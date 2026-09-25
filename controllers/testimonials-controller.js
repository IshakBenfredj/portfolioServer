const crypto = require("crypto");
const Testimonial = require("../models/testimonial");
const ReviewInvite = require("../models/reviewInvite");

// 1. Get all testimonials (public)
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ isVerified: -1, createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Get testimonials error:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

// 2. Add testimonial manually (admin)
const addTestimonial = async (req, res) => {
  try {
    const {
      name,
      text,
      gender = "male",
      role = "عميل / شريك عمل",
      company = "",
      projectTitle = "",
      rating = 5,
      image = "",
      isVerified = false,
    } = req.body;

    if (!name || !text) {
      return res.status(400).json({ error: "Name and text are required" });
    }

    const testimonial = await Testimonial.create({
      name,
      text,
      gender,
      role,
      company,
      projectTitle,
      rating: Number(rating) || 5,
      image,
      isVerified: Boolean(isVerified),
      verifiedAt: isVerified ? new Date() : null,
      createdAt: new Date(),
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Add testimonial error:", error);
    res.status(500).json({ error: "Failed to add testimonial" });
  }
};

// 3. Delete testimonial (admin)
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
};

// 4. Generate unique review invite link (admin)
const generateInvite = async (req, res) => {
  try {
    const {
      clientName,
      projectName,
      clientEmail = "",
      clientPhone = "",
      projectCategory = "تطوير تطبيقات ومواقع الويب",
    } = req.body;

    if (!clientName || !projectName) {
      return res.status(400).json({
        success: false,
        message: "Client name and project name are required",
      });
    }

    // Generate secure random token
    const token = `REV-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

    const invite = await ReviewInvite.create({
      token,
      clientName: clientName.trim(),
      projectName: projectName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      projectCategory: projectCategory.trim(),
      isUsed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return res.status(201).json({
      success: true,
      message: "Review invite generated successfully",
      invite,
      token: invite.token,
    });
  } catch (error) {
    console.error("Generate review invite error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate invite" });
  }
};

// 5. Get all review invites (admin)
const getInvites = async (req, res) => {
  try {
    const invites = await ReviewInvite.find()
      .populate("createdTestimonialId")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, invites });
  } catch (error) {
    console.error("Get review invites error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch invites" });
  }
};

// 6. Delete/revoke an invite (admin)
const deleteInvite = async (req, res) => {
  try {
    const { id } = req.params;
    await ReviewInvite.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Invite deleted successfully" });
  } catch (error) {
    console.error("Delete invite error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete invite" });
  }
};

// 7. Verify review token (public client)
const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const invite = await ReviewInvite.findOne({ token: token.toUpperCase() });

    if (!invite) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "رابط التقييم غير صحيح أو تم حذفه.",
      });
    }

    if (invite.isUsed) {
      return res.status(400).json({
        success: false,
        valid: false,
        isUsed: true,
        message: "تم استخدام هذا الرابط مسبقاً لتقديم تقييم موثق. شكراً جزيلاً لتعاونكم!",
      });
    }

    if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) {
      return res.status(400).json({
        success: false,
        valid: false,
        isExpired: true,
        message: "عذراً، لقد انتهت صلاحية رابط التقييم هذا.",
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      invite: {
        token: invite.token,
        clientName: invite.clientName,
        projectName: invite.projectName,
        projectCategory: invite.projectCategory,
      },
    });
  } catch (error) {
    console.error("Verify review token error:", error);
    return res.status(500).json({ success: false, message: "Error verifying token" });
  }
};

// 8. Submit verified client review (public client)
const submitVerifiedReview = async (req, res) => {
  try {
    const {
      token,
      name,
      role = "عميل موثق",
      company = "",
      rating = 5,
      text,
      gender = "male",
      image = "",
    } = req.body;

    if (!token || !name || !text) {
      return res.status(400).json({
        success: false,
        message: "Token, name, and review text are required",
      });
    }

    const invite = await ReviewInvite.findOne({ token: token.toUpperCase() });

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "رابط التقييم غير موجود",
      });
    }

    if (invite.isUsed) {
      return res.status(400).json({
        success: false,
        message: "تم إرسال هذا التقييم مسبقاً!",
      });
    }

    // Create Testimonial with verified badge
    const testimonial = await Testimonial.create({
      name: name.trim(),
      role: role.trim() || "عميل موثق",
      company: company.trim(),
      projectTitle: invite.projectName,
      text: text.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      gender: gender === "female" ? "female" : "male",
      image: image || "",
      isVerified: true,
      verifiedAt: new Date(),
      inviteToken: invite.token,
      createdAt: new Date(),
    });

    // Mark invite as used
    invite.isUsed = true;
    invite.usedAt = new Date();
    invite.createdTestimonialId = testimonial._id;
    await invite.save();

    return res.status(201).json({
      success: true,
      message: "تم استلام تقييمكم الموثق بنجاح ونشره في معرض التقييمات! شكراً لثقتكم.",
      testimonial,
    });
  } catch (error) {
    console.error("Submit verified review error:", error);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء حفظ التقييم",
    });
  }
};

module.exports = {
  getTestimonials,
  addTestimonial,
  deleteTestimonial,
  generateInvite,
  getInvites,
  deleteInvite,
  verifyToken,
  submitVerifiedReview,
};