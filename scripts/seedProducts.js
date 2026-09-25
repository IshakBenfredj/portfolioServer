const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/product');

const productsToSeed = [
  {
    title: "منصة وتطبيق إدارة خدمات التوصيل والطلبيات (Delivery Platform & Mobile App & Telegram Bot)",
    price: "25,000 دج",
    oldPrice: "38,000 دج",
    category: "templates",
    shortDesc: "منصة متكاملة ومخصصة لخدمات التوصيل: موقع ويب للزبائن لطلب التوصيل، لوحة تحكم شاملة لإدارة وتصنيف المشتريات وقائمة التكويش، تطبيق موبايل للأدمن مع إشعارات فورية، وربط مباشر مع بوت Telegram لتتبع الطلبيات لحظياً.",
    description: "🚀 عندك خدمة توصيل وحاب تطورها؟ إذا راك تستقبل الطلبيات بالمكالمات والرسائل، وتضيع وقتك بين العناوين والكميات وتفاصيل كل طلبية… نقدروا نبنولك منصة خاصة بخدمتك، باسمك وبالطريقة لي تناسبك.\n\n🌐 موقع خاص بيك: الزبون يدخل للمنصة، يعمّر معلوماته، عنوان التوصيل، وتفاصيل الطلبية بسهولة، وأنت تستقبل كل الطلبات منظمة في مكان واحد.\n\n📊 لوحة تحكم كاملة وشاملة: تتابع منها الطلبيات، العناوين وحالتها، مع تصنيف المنتجات حسب النوع، وميزة التكويش على المنتجات لي شريتهم باش تعرف دائماً واش جبت وواش مزال بكل سهولة.\n\n📱 تطبيق موبايل خاص بيك: مع إشعارات فورية تصلك في اللحظة كلما تدخل طلبية جديدة، وتقدر تتابع وتدير كامل طلباتك مباشرة من هاتفك أينما كنت.\n\n🤖 ربط سريع مع بوت Telegram: كلما تدخل طلبية جديدة توصلك تنبيهات مباشرة في البوت 🔔 وتقدر تفتح الطلبية في المنصة أو تتصفح الطلبات مباشرة من Telegram.\n\n💡 والأفضل؟ المنصة تتأقلم تماماً مع طريقة خدمتك: كل الميزات المذكورة جاهزة ومدمجة، ونقدروا نزيدو نطوّرولك ميزات وتعديلات خاصة إضافية على حسب طبيعة عملك ونشاطك.\n\n🎁 هدية مع المنصة: نصممولك ملصق إعلاني احترافي باسم خدمتك ورقم هاتفك، تقدر تطبعو وتحطو عند المحلات لي تتعامل معاهم باش الزبائن يطلبوا منك بسهولة.\n\nما تحتاجش تتأقلم مع منصة جاهزة… نبنولك منصة تتأقلم مع خدمتك. 🚀 إذا راك حاب تنظم خدمتك، تربح الوقت، وتخلي استقبال الطلبيات أكثر احترافية... 📲 راسلنا اليوم وخلي خدمتك تدخل للمستوى الموالي!",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80"
    ],
    demoUrl: "",
    status: "ready",
    tags: [
      "خدمة توصيل",
      "Delivery Platform",
      "React.js",
      "React Native",
      "Telegram Bot",
      "لوحة تحكم",
      "إشعارات فورية",
      "Node.js",
      "إدارة الطلبيات"
    ],
    sections: [
      {
        title: "🌐 موقع خاص بيك للزبائن (Customer Ordering Web Platform)",
        icon: "globe",
        description: "الزبون يدخل للمنصة، يعمّر معلوماته، عنوان التوصيل، وتفاصيل الطلبية بسهولة، وأنت تستقبل كل الطلبات منظمة في مكان واحد.",
        items: [
          { text: "واجهة طلب ويب سهلة وبسيطة للزبون لإدخال معلوماته ورقم هاتفه", icon: "check" },
          { text: "تحديد عنوان التوصيل بدقة مع تفاصيل ونوع الطلبية والكميات المطلوبة", icon: "globe" },
          { text: "استقبال وتنظيم كافة الطلبيات الواردة في مكان واحد دون ضياع أي تفاصيل", icon: "package" },
          { text: "الاستغناء التام عن فوضى وتشتت المكالمات والرسائل الصوتية المجهدة", icon: "zap" }
        ]
      },
      {
        title: "📊 لوحة تحكم كاملة وشاملة (Comprehensive Admin Dashboard)",
        icon: "gauge",
        description: "تتابع منها الطلبيات، العناوين وحالتها، مع تصنيف المنتجات حسب النوع، وميزة التكويش على المنتجات لي شريتهم.",
        items: [
          { text: "متابعة الطلبيات والعناوين وحالتها لحظة بلحظة مع تصنيف المنتجات حسب النوع", icon: "gauge" },
          { text: "ميزة التكويش (Checklist) على المنتجات لي شريتهم باش تعرف دائماً واش جبت وواش مزال بكل سهولة", icon: "check" },
          { text: "تصنيف ومطابقة الطلبيات حسب المناطق والمحلات لتسهيل وتوفير وقت الجولات", icon: "layers" },
          { text: "إحصائيات دورية وسريعة لحجم الطلبيات اليومية والأداء العام لخدمتك", icon: "sparkles" }
        ]
      },
      {
        title: "📱 تطبيق موبايل خاص بيك (Mobile App with Instant Notifications)",
        icon: "mobile",
        description: "مع إشعارات فورية تصلك في اللحظة كلما تدخل طلبية جديدة، وتقدر تتابع وتدير كامل طلباتك مباشرة من هاتفك أينما كنت.",
        items: [
          { text: "إشعارات فورية (Push Notifications) تصلك في اللحظة والثانية كلما تدخل طلبية جديدة", icon: "zap" },
          { text: "متابعة وإدارة كامل طلباتك وتحديث حالتها مباشرة من هاتفك أينما كنت", icon: "mobile" },
          { text: "عرض تفاصيل العنوان وأرقام الهواتف مع إمكانية الاتصال السريع بنقرة واحدة", icon: "users" },
          { text: "واجهة سريعة وخفيفة تدعم الوضع المظلم (Dark Mode) لراحة العين أثناء العمل", icon: "palette" }
        ]
      },
      {
        title: "🤖 ربط سريع مع بوت Telegram (Telegram Bot Integration)",
        icon: "zap",
        description: "كلما تدخل طلبية جديدة توصلك تنبيهات مباشرة في البوت 🔔 وتقدر تفتح الطلبية في المنصة أو تتصفح الطلبات مباشرة من Telegram.",
        items: [
          { text: "كلما تدخل طلبية جديدة توصلك تنبيهات مباشرة في البوت 🔔 مع ملخص الطلبية", icon: "zap" },
          { text: "إمكانية فتح الطلبية في المنصة مباشرة بنقرة زر واحدة من داخل المحادثة", icon: "globe" },
          { text: "تصفح ومراجعة قوائم الطلبيات اليومية مباشرة وبسرعة فائقة من Telegram", icon: "check" }
        ]
      },
      {
        title: "💡 المنصة تتأقلم تماماً مع طريقة خدمتك (Customizable & Scalable)",
        icon: "settings",
        description: "كل الميزات المذكورة جاهزة ومدمجة، ونقدروا نزيدو نطوّرولك ميزات وتعديلات خاصة إضافية على حسب طبيعة عملك ونشاطك.",
        items: [
          { text: "كل الميزات المذكورة جاهزة ومدمجة وتعمل باسمك وهويتك الخاصة", icon: "shield" },
          { text: "إمكانية تطوير ميزات وتعديلات خاصة إضافية على حسب طبيعة عملك ونشاطك الجغرافي", icon: "code" },
          { text: "ما تحتاجش تتأقلم مع منصة جاهزة… نبنولك منصة تتأقلم مع خدمتك 100%", icon: "sparkles" }
        ]
      },
      {
        title: "🎁 هدية مع المنصة: ملصق إعلاني احترافي (Bonus Marketing Poster)",
        icon: "package",
        description: "نصممولك ملصق إعلاني احترافي باسم خدمتك ورقم هاتفك، تقدر تطبعو وتحطو عند المحلات لي تتعامل معاهم باش الزبائن يطلبوا منك بسهولة.",
        items: [
          { text: "تصميم ملصق إعلاني احترافي باسم خدمتك ورقم هاتفك ورمز QR كود للدخول المباشر", icon: "sparkles" },
          { text: "جاهز للطباعة والتعليق عند المحلات لي تتعامل معاهم باش الزبائن يطلبوا منك بسهولة", icon: "check" },
          { text: "تصميم جذاب وعصري يزيد من ثقة الزبائن ويرفع عدد الطلبيات اليومية", icon: "palette" }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("MONGODB_URL is missing in environment variables.");
      process.exit(1);
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB.");

    for (const item of productsToSeed) {
      const existing = await Product.findOne({ title: item.title });
      if (existing) {
        console.log(`Product "${item.title}" already exists in MongoDB. Updating...`);
        await Product.findByIdAndUpdate(existing._id, item);
      } else {
        console.log(`Creating product "${item.title}" in MongoDB...`);
        await Product.create(item);
      }
    }

    console.log("Seeding completed successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seed();
