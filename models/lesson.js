const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
    },
    titleFr: {
      type: String,
    },
    slug: {
      type: String,
      index: true,
    },
    summary: {
      type: String,
    },
    summaryAr: {
      type: String,
    },
    summaryFr: {
      type: String,
    },
    content: {
      type: String,
    },
    contentAr: {
      type: String,
    },
    contentFr: {
      type: String,
    },
    category: {
      type: String,
      default: "Full-Stack Web",
    },
    categoryAr: {
      type: String,
    },
    categoryFr: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: String,
      default: "5 min",
    },
    author: {
      type: String,
      default: "Ishak Benfredj",
    },
    link: {
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;