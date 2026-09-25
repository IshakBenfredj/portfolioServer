const Meeting = require("../models/meeting");
const dotenv = require("dotenv");
dotenv.config();

// POST add new meeting / consultation request
const addMeeting = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      channel,
      topicCategory,
      topicDetails,
      projectBudget,
      preferredDate,
      preferredTimeSlot,
    } = req.body;

    if (
      !clientName ||
      !clientEmail ||
      !clientPhone ||
      !topicDetails ||
      !preferredDate ||
      !preferredTimeSlot
    ) {
      return res.status(400).json({
        message: "الرجاء ملء جميع الحقول المطلوبة بما في ذلك موضوع وتفاصيل المناقشة وموعد اللقاء.",
      });
    }

    const newMeeting = new Meeting({
      clientName,
      clientEmail,
      clientPhone,
      channel: channel || "meet",
      topicCategory: topicCategory || "new_project",
      topicDetails,
      projectBudget: projectBudget || "",
      preferredDate,
      preferredTimeSlot,
      status: "pending",
    });

    const savedMeeting = await newMeeting.save();

    res.status(201).json({
      message: "تم إرسال طلب حجز الجلسة بنجاح وهو قيد المراجعة.",
      meeting: savedMeeting,
    });
  } catch (error) {
    console.error("Error creating meeting request:", error);
    res.status(500).json({
      message: "فشل إرسال طلب حجز الجلسة.",
      error: error.message,
    });
  }
};

// GET all meetings (for admin dashboard)
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({
      message: "فشل جلب طلبات الجلسات الاستشارية.",
      error: error.message,
    });
  }
};

// PUT update meeting status & meeting link / notes
const updateMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meetingLink, adminNotes } = req.body;

    if (status && !["pending", "accepted", "declined", "completed"].includes(status)) {
      return res.status(400).json({ message: "حالة غير صالحة." });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (meetingLink !== undefined) updateFields.meetingLink = meetingLink;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "طلب الجلسة غير موجود." });
    }

    res.status(200).json({
      message: "تم تحديث حالة الجلسة بنجاح.",
      meeting: updatedMeeting,
    });
  } catch (error) {
    res.status(500).json({
      message: "فشل تحديث حالة الجلسة.",
      error: error.message,
    });
  }
};

// DELETE meeting
const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Meeting.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "طلب الجلسة غير موجود." });
    }
    res.status(200).json({ message: "تم حذف طلب الجلسة بنجاح.", id });
  } catch (error) {
    res.status(500).json({
      message: "فشل حذف طلب الجلسة.",
      error: error.message,
    });
  }
};

module.exports = {
  addMeeting,
  getMeetings,
  updateMeetingStatus,
  deleteMeeting,
};
