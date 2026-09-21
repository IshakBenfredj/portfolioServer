const jwt = require("jsonwebtoken");
const Portfolio = require("../models/portfolio.js");
const Service = require("../models/service.js");
const Skill = require("../models/skill.js");
const Message = require("../models/message.js");
const Comment = require("../models/comment.js");
const Lesson = require("../models/lesson.js");
const Testimonial = require("../models/testimonial.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const expectedEmail = process.env.ADMIN_EMAIL || "ishak.djilalibenfredj@gmail.com";
    const expectedPass = process.env.ADMIN_PASS || "ishak1011";

    if (
      email &&
      password &&
      email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
      password.trim() === expectedPass.trim()
    ) {
      const secret = process.env.JWT_SECRET || "ishak_portfolio_jwt_super_secret_key_2024";
      const token = jwt.sign(
        { email: expectedEmail, role: "admin" },
        secret,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        admin: {
          email: expectedEmail,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const [
      totalProjects,
      totalServices,
      totalSkills,
      totalMessages,
      workLeads,
      totalComments,
      totalLessons,
      totalTestimonials,
      totalProducts,
      totalOrders,
      projectsList,
      recentMessages,
      recentOrders,
    ] = await Promise.all([
      Portfolio.countDocuments(),
      Service.countDocuments(),
      Skill.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ isWork: true }),
      Comment.countDocuments(),
      Lesson.countDocuments(),
      Testimonial.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Portfolio.find({}, "views title"),
      Message.find().sort({ createdAt: -1 }).limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const totalViews = projectsList.reduce((acc, curr) => acc + (curr.views || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalServices,
        totalSkills,
        totalMessages,
        workLeads,
        totalComments,
        totalLessons,
        totalTestimonials,
        totalProducts,
        totalOrders,
        totalViews,
      },
      recentMessages,
      recentOrders,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

module.exports = {
  adminLogin,
  getAdminStats,
};
