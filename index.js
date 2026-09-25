const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");

// Import Routes
const skillsRoutes = require("./routes/skills-routes");
const portfolioRoutes = require("./routes/portfolio-routes");
const servicesRoutes = require("./routes/services-routes");
const testimonialsRoutes = require("./routes/testimonials-routes");
const messagesRoutes = require("./routes/messages-routes");
const commentsRoutes = require("./routes/comments-routes");
const lessonsRoutes = require("./routes/lessons-routes");
const productsRoutes = require("./routes/products-routes");
const ordersRoutes = require("./routes/orders-routes");
const meetingsRoutes = require("./routes/meetings-routes");
const categoryRoutes = require("./routes/category-routes");
const analyticsRoutes = require("./routes/analytics-routes");
const adminRoutes = require("./routes/admin-routes");
const job = require("./cron");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

job.start();

app.use(express.json({ limit: "100mb" }));

app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use(bodyParser.text({ limit: "200mb" }));

// Routes
app.use("/admin", adminRoutes);
app.use("/skills", skillsRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/services", servicesRoutes);
app.use("/testimonials", testimonialsRoutes);
app.use("/messages", messagesRoutes);
app.use("/comments", commentsRoutes);
app.use("/lessons", lessonsRoutes);
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/meetings", meetingsRoutes);
app.use("/categories", categoryRoutes);
app.use("/analytics", analyticsRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("connected to db & listening on port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.timeout = 600000;
