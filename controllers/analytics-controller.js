const crypto = require("crypto");
const VisitorLog = require("../models/visitorLog");
const Portfolio = require("../models/portfolio");
const Product = require("../models/product");
const Lesson = require("../models/lesson");

// Intelligent User-Agent and Device Model parser
const parseUserAgent = (uaString = "", clientModel = "") => {
  const ua = uaString;
  const uaLower = uaString.toLowerCase();

  // Device Category
  let device = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(uaLower)) {
    device = "tablet";
  } else if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      uaLower
    )
  ) {
    device = "mobile";
  }

  // Specific Device Model extraction (e.g. realme-C67, Redmi-12C, DESKTOP-P0I6AAG, itel-A50)
  let deviceName = clientModel || "";

  if (!deviceName) {
    if (/iphone/i.test(uaLower)) {
      deviceName = "Apple iPhone";
    } else if (/ipad/i.test(uaLower)) {
      deviceName = "Apple iPad";
    } else if (/macintosh|mac os x/i.test(uaLower)) {
      deviceName = "Apple Mac (macOS)";
    } else if (/windows nt 10.0/i.test(uaLower)) {
      // Generate a realistic desktop ID if not provided
      const hashShort = crypto.createHash("md5").update(ua).digest("hex").slice(0, 6).toUpperCase();
      deviceName = `DESKTOP-${hashShort}`;
    } else if (/windows/i.test(uaLower)) {
      deviceName = "Windows PC";
    } else if (/linux/i.test(uaLower)) {
      deviceName = "Linux PC";
    }

    // Android Model specific parsing
    const androidMatch = ua.match(/;\s*([^;]+?)\s*Build\//i);
    if (androidMatch && androidMatch[1]) {
      let rawModel = androidMatch[1].trim();
      // Clean model name
      if (/rmx\d+/i.test(rawModel)) {
        if (/rmx3890/i.test(rawModel)) rawModel = "realme-C67";
        else if (/rmx3710/i.test(rawModel)) rawModel = "realme-C55";
        else if (/rmx3624/i.test(rawModel)) rawModel = "realme-C33";
        else rawModel = `realme-${rawModel.replace(/rmx/i, "C")}`;
      } else if (/23076rn4bi|22120rn86g|220333qny/i.test(rawModel)) {
        rawModel = "Redmi-12C";
      } else if (/23049pcd8g/i.test(rawModel)) {
        rawModel = "POCO-F5";
      } else if (/sm-a\d+/i.test(rawModel)) {
        rawModel = `Samsung-${rawModel.toUpperCase()}`;
      } else if (/itel/i.test(rawModel)) {
        rawModel = rawModel.replace(/\s+/g, "-");
      }
      deviceName = rawModel;
    }
  }

  if (!deviceName) {
    deviceName = device === "mobile" ? "Mobile-Device" : "DESKTOP-DEVICE";
  }

  // OS
  let os = "Other";
  if (/windows nt 10.0|windows 11/i.test(uaLower)) os = "Windows 11/10";
  else if (/windows/i.test(uaLower)) os = "Windows";
  else if (/android/i.test(uaLower)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(uaLower)) os = "iOS";
  else if (/macintosh|mac os x/i.test(uaLower)) os = "MacOS";
  else if (/linux/i.test(uaLower)) os = "Linux";

  // Browser
  let browser = "Other";
  if (/edg/i.test(uaLower)) browser = "Edge";
  else if (/opr|opera/i.test(uaLower)) browser = "Opera";
  else if (/chrome|crios/i.test(uaLower)) browser = "Chrome";
  else if (/firefox|fxios/i.test(uaLower)) browser = "Firefox";
  else if (/safari/i.test(uaLower) && !/chrome/i.test(uaLower)) browser = "Safari";

  return { device, os, browser, deviceName };
};

// 1. Track visit
const trackVisit = async (req, res) => {
  try {
    const rawIp =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const cleanRawIp = rawIp.replace(/^::ffff:/, "");
    const ipHash = crypto.createHash("sha256").update(cleanRawIp).digest("hex").slice(0, 24);

    const uaHeader = req.headers["user-agent"] || "";
    const {
      path = "/",
      title = "",
      entityType = "general",
      entityId = null,
      referrer = "direct",
      device: clientDevice,
      deviceName: clientDeviceName,
      country: clientCountry,
      countryCode: clientCountryCode,
      city: clientCity,
    } = req.body || {};

    const { device: uaDevice, os, browser, deviceName: parsedDeviceName } = parseUserAgent(
      uaHeader,
      clientDeviceName
    );

    const device = clientDevice || uaDevice || "desktop";
    const deviceName = clientDeviceName || parsedDeviceName;

    // Check if this IP is blocked
    const existingBlocked = await VisitorLog.findOne({ ipHash, isBlocked: true });
    if (existingBlocked) {
      return res.status(403).json({ success: false, message: "Blocked" });
    }

    // Country detection
    const country =
      req.headers["cf-ipcountry"] ||
      clientCountry ||
      "Algeria";
    const countryCode =
      (req.headers["cf-ipcountry"] || clientCountryCode || "DZ").toUpperCase();
    const city = clientCity || "";

    // Clean Referrer
    let cleanReferrer = "direct";
    if (referrer && referrer !== "direct" && referrer !== "") {
      try {
        const url = new URL(referrer);
        const host = url.hostname.replace("www.", "");
        if (host.includes("google")) cleanReferrer = "Google";
        else if (host.includes("linkedin")) cleanReferrer = "LinkedIn";
        else if (host.includes("github")) cleanReferrer = "GitHub";
        else if (host.includes("facebook")) cleanReferrer = "Facebook";
        else if (host.includes("twitter") || host.includes("x.com")) cleanReferrer = "Twitter/X";
        else if (host.includes("whatsapp")) cleanReferrer = "WhatsApp";
        else if (host.includes("t.me") || host.includes("telegram")) cleanReferrer = "Telegram";
        else cleanReferrer = host;
      } catch {
        cleanReferrer = referrer.slice(0, 50);
      }
    }

    // Save Log
    const log = await VisitorLog.create({
      ipHash,
      rawIp: cleanRawIp,
      deviceName,
      path: path.slice(0, 200),
      title: title.slice(0, 200),
      entityType,
      entityId,
      referrer: cleanReferrer,
      device,
      browser,
      os,
      country,
      countryCode,
      city,
      timestamp: new Date(),
    });

    // Optionally increment entity view count asynchronously
    if (entityId) {
      if (entityType === "portfolio") {
        Portfolio.findByIdAndUpdate(entityId, { $inc: { views: 1 } }).catch(() => {});
      } else if (entityType === "product") {
        Product.findByIdAndUpdate(entityId, { $inc: { views: 1 } }).catch(() => {});
      } else if (entityType === "lesson") {
        Lesson.findByIdAndUpdate(entityId, { $inc: { views: 1 } }).catch(() => {});
      }
    }

    return res.status(200).json({ success: true, logId: log._id });
  } catch (error) {
    console.error("Track visit error:", error);
    return res.status(200).json({ success: false });
  }
};

// 2. Get Detailed Connected Visitors / Devices Table (Like Router Management Screen)
const getVisitorsList = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const visitorsAggregate = await VisitorLog.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$ipHash",
          rawIp: { $first: "$rawIp" },
          deviceName: { $first: "$deviceName" },
          device: { $first: "$device" },
          browser: { $first: "$browser" },
          os: { $first: "$os" },
          country: { $first: "$country" },
          countryCode: { $first: "$countryCode" },
          city: { $first: "$city" },
          currentPath: { $first: "$path" },
          lastTitle: { $first: "$title" },
          lastSeen: { $first: "$timestamp" },
          firstSeen: { $last: "$timestamp" },
          isBlocked: { $first: "$isBlocked" },
          totalViews: { $sum: 1 },
        },
      },
      { $sort: { lastSeen: -1 } },
      { $limit: 100 },
    ]);

    const visitors = visitorsAggregate.map((v) => {
      const isOnline = new Date(v.lastSeen) >= fiveMinutesAgo;
      return {
        ipHash: v._id,
        rawIp: v.rawIp || "127.0.0.1",
        deviceName: v.deviceName || "DESKTOP-DEVICE",
        device: v.device || "desktop",
        browser: v.browser || "Chrome",
        os: v.os || "Windows",
        country: v.country || "Algeria",
        countryCode: v.countryCode || "DZ",
        city: v.city || "",
        currentPath: v.currentPath || "/",
        lastTitle: v.lastTitle || "الرئيسية",
        lastSeen: v.lastSeen,
        firstSeen: v.firstSeen,
        isBlocked: Boolean(v.isBlocked),
        isOnline,
        statusText: isOnline ? "متصل الآن" : "غير متصل",
        totalViews: v.totalViews || 1,
      };
    });

    return res.status(200).json({
      success: true,
      visitors,
      totalCount: visitors.length,
      onlineCount: visitors.filter((v) => v.isOnline).length,
    });
  } catch (error) {
    console.error("Get visitors list error:", error);
    return res.status(500).json({ success: false, message: "Error fetching visitors list" });
  }
};

// 3. Toggle Block Visitor
const toggleBlockVisitor = async (req, res) => {
  try {
    const { ipHash } = req.params;
    const current = await VisitorLog.findOne({ ipHash });
    const newStatus = current ? !current.isBlocked : true;

    await VisitorLog.updateMany({ ipHash }, { $set: { isBlocked: newStatus } });

    return res.status(200).json({
      success: true,
      isBlocked: newStatus,
      message: newStatus ? "تم حظر الجهاز" : "تم إلغاء الحظر",
    });
  } catch (error) {
    console.error("Toggle block visitor error:", error);
    return res.status(500).json({ success: false, message: "Error toggling block" });
  }
};

// 4. Delete visitor logs (X button)
const deleteVisitorLogs = async (req, res) => {
  try {
    const { ipHash } = req.params;
    await VisitorLog.deleteMany({ ipHash });
    return res.status(200).json({ success: true, message: "تم مسح سجلات الجهاز بنجاح" });
  } catch (error) {
    console.error("Delete visitor logs error:", error);
    return res.status(500).json({ success: false, message: "Error deleting visitor logs" });
  }
};

// 5. Clear all logs
const clearAllLogs = async (req, res) => {
  try {
    await VisitorLog.deleteMany({});
    return res.status(200).json({ success: true, message: "تم مسح جميع سجلات التحليلات بنجاح" });
  } catch (error) {
    console.error("Clear all logs error:", error);
    return res.status(500).json({ success: false, message: "Error clearing logs" });
  }
};

// 6. Analytics Summary
const getAnalyticsSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const [
      totalViews,
      uniqueVisitorsCount,
      todayViews,
      todayUniqueCount,
      weekViews,
      monthViews,
      onlineVisitorsCount,
      dailyTrendRaw,
      deviceStatsRaw,
      browserStatsRaw,
      osStatsRaw,
      countryStatsRaw,
      topPagesRaw,
      topReferrersRaw,
      topProjects,
      topProducts,
      topLessons,
    ] = await Promise.all([
      VisitorLog.countDocuments(),
      VisitorLog.distinct("ipHash").then((res) => res.length),
      VisitorLog.countDocuments({ timestamp: { $gte: startOfToday } }),
      VisitorLog.distinct("ipHash", { timestamp: { $gte: startOfToday } }).then((res) => res.length),
      VisitorLog.countDocuments({ timestamp: { $gte: sevenDaysAgo } }),
      VisitorLog.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      VisitorLog.distinct("ipHash", { timestamp: { $gte: fiveMinutesAgo } }).then((res) => res.length),
      VisitorLog.aggregate([
        { $match: { timestamp: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            views: { $sum: 1 },
            uniqueIps: { $addToSet: "$ipHash" },
          },
        },
        {
          $project: {
            date: "$_id",
            views: 1,
            uniqueVisitors: { $size: "$uniqueIps" },
          },
        },
        { $sort: { date: 1 } },
      ]),
      VisitorLog.aggregate([
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      VisitorLog.aggregate([
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      VisitorLog.aggregate([
        { $group: { _id: "$os", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      VisitorLog.aggregate([
        {
          $group: {
            _id: { country: "$country", countryCode: "$countryCode" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 8 },
        {
          $project: {
            country: "$_id.country",
            countryCode: "$_id.countryCode",
            count: 1,
          },
        },
      ]),
      VisitorLog.aggregate([
        {
          $group: {
            _id: "$path",
            views: { $sum: 1 },
            title: { $first: "$title" },
            entityType: { $first: "$entityType" },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
      VisitorLog.aggregate([
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Portfolio.find({}, "title views category img").sort({ views: -1 }).limit(5),
      Product.find({}, "title views price image category").sort({ views: -1 }).limit(5),
      Lesson.find({}, "title views category image").sort({ views: -1 }).limit(5),
    ]);

    const last7DaysList = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const found = dailyTrendRaw.find((item) => item.date === dateStr);
      last7DaysList.push({
        date: dateStr,
        dayName: d.toLocaleDateString("ar-EG", { weekday: "short" }),
        dayNameEn: d.toLocaleDateString("en-US", { weekday: "short" }),
        views: found ? found.views : 0,
        uniqueVisitors: found ? found.uniqueVisitors : 0,
      });
    }

    return res.status(200).json({
      success: true,
      summary: {
        totalViews,
        totalUniqueVisitors: uniqueVisitorsCount,
        todayViews,
        todayUniqueVisitors: todayUniqueCount,
        weekViews,
        monthViews,
        onlineVisitors: onlineVisitorsCount,
        dailyTrend: last7DaysList,
        devices: deviceStatsRaw.map((d) => ({
          name: d._id || "Desktop",
          count: d.count,
          percentage: totalViews > 0 ? Math.round((d.count / totalViews) * 100) : 0,
        })),
        browsers: browserStatsRaw.map((b) => ({
          name: b._id || "Other",
          count: b.count,
          percentage: totalViews > 0 ? Math.round((b.count / totalViews) * 100) : 0,
        })),
        os: osStatsRaw.map((o) => ({
          name: o._id || "Other",
          count: o.count,
          percentage: totalViews > 0 ? Math.round((o.count / totalViews) * 100) : 0,
        })),
        countries: countryStatsRaw,
        topPages: topPagesRaw.map((p) => ({
          path: p._id,
          title: p.title || p._id,
          entityType: p.entityType || "general",
          views: p.views,
        })),
        topReferrers: topReferrersRaw.map((r) => ({
          source: r._id || "direct",
          count: r.count,
        })),
        topProjects,
        topProducts,
        topLessons,
      },
    });
  } catch (error) {
    console.error("Get analytics summary error:", error);
    return res.status(500).json({ success: false, message: "Error fetching analytics" });
  }
};

module.exports = {
  trackVisit,
  getAnalyticsSummary,
  getVisitorsList,
  toggleBlockVisitor,
  deleteVisitorLogs,
  clearAllLogs,
};
