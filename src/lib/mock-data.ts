import { addDays, subDays } from "date-fns";
import type {
    BlogInsightsSummary,
    BlogPost,
    HealthResponse,
    Order,
    Product,
} from "./types";

const now = new Date();

export const mockHealth: HealthResponse = {
    status: "ok",
    version: "1.0.0",
    uptime: "72h 15m",
    dependencies: {
        database: "connected",
        cache: "degraded",
    },
};

export const mockProducts: Product[] = [
    {
        id: "daily-probiotic-chew",
        name: "قرص نرم پروبیوتیک روزانه",
        description:
            "ترکیب شش سویه پروبیوتیک همراه با پری‌بیوتیک برای آرام کردن معده و بهبود جذب مواد غذایی سگ‌های خانگی.",
        price: 289_000,
        currency: "IRR",
        status: "active",
        stock: 320,
        tags: ["probiotic", "digestion"],
        createdAt: subDays(now, 12).toISOString(),
        updatedAt: subDays(now, 1).toISOString(),
    },
    {
        id: "hip-joint-powder",
        name: "پودر حمایت از مفاصل",
        description:
            "حاوی گلوکزامین، کندرویتین و زردچوبه برای کاهش التهاب مفاصل و حفظ تحرک سگ‌های میان‌سال.",
        price: 365_000,
        currency: "IRR",
        status: "active",
        stock: 210,
        tags: ["mobility", "anti-inflammatory"],
        createdAt: subDays(now, 25).toISOString(),
        updatedAt: subDays(now, 4).toISOString(),
    },
    {
        id: "omega-soft-chew",
        name: "نرم‌جو امگا ۳ براق‌کننده مو",
        description:
            "سرشار از روغن ماهی خالص و ویتامین E برای کاهش ریزش مو و درخشش پوشش خارجی سگ‌های حساس.",
        price: 315_000,
        currency: "IRR",
        status: "active",
        stock: 150,
        tags: ["skin", "coat"],
        createdAt: subDays(now, 18).toISOString(),
        updatedAt: subDays(now, 2).toISOString(),
    },
    {
        id: "calming-bedtime-kit",
        name: "کیـت آرامش شبانه",
        description:
            "ست سه‌گانه شامل قطره آرام‌بخش، اسپری محیطی با اسطوخودوس و تشکچه ضد اضطراب برای آرام کردن سگ‌های مضطرب.",
        price: 459_000,
        currency: "IRR",
        status: "active",
        stock: 95,
        tags: ["anxiety", "sleep"],
        createdAt: subDays(now, 6).toISOString(),
        updatedAt: subDays(now, 3).toISOString(),
    },
];

export const mockOrders: Order[] = [
    {
        id: "order-9842",
        userId: "user-123",
        status: "fulfilled",
        total: 893_000,
        currency: "IRR",
        createdAt: subDays(now, 5).toISOString(),
        updatedAt: subDays(now, 1).toISOString(),
        lineItems: [
            {
                productId: "daily-probiotic-chew",
                name: "قرص نرم پروبیوتیک روزانه",
                quantity: 2,
                price: 289_000,
                currency: "IRR",
            },
            {
                productId: "omega-soft-chew",
                name: "نرم‌جو امگا ۳ براق‌کننده مو",
                quantity: 1,
                price: 315_000,
                currency: "IRR",
            },
        ],
    },
    {
        id: "order-9850",
        userId: "user-456",
        status: "processing",
        total: 824_000,
        currency: "IRR",
        createdAt: subDays(now, 2).toISOString(),
        lineItems: [
            {
                productId: "hip-joint-powder",
                name: "پودر حمایت از مفاصل",
                quantity: 1,
                price: 365_000,
                currency: "IRR",
            },
            {
                productId: "calming-bedtime-kit",
                name: "کیـت آرامش شبانه",
                quantity: 1,
                price: 459_000,
                currency: "IRR",
            },
        ],
    },
    {
        id: "order-9861",
        userId: "user-789",
        status: "pending",
        total: 289_000,
        currency: "IRR",
        createdAt: addDays(now, -0.5).toISOString(),
        lineItems: [
            {
                productId: "daily-probiotic-chew",
                name: "قرص نرم پروبیوتیک روزانه",
                quantity: 1,
                price: 289_000,
                currency: "IRR",
            },
        ],
    },
];

export const mockBlogPosts: BlogPost[] = [
    {
        id: "post-gut-health",
        producerId: "Boofshop",
        title: "چطور پروبیوتیک سلامت روده سگ را متحول می‌کند؟",
        slug: "probiotic-gut-health-for-dogs",
        excerpt:
            "راهنمای کامل انتخاب پروبیوتیک مناسب برای کاهش نفخ، بهبود اشتها و افزایش ایمنی سگ‌های خانگی.",
        contentMarkdown:
            "## چرا روده مرکز سلامتی است؟\n\nباکتری‌های مفید روده با تولید اسیدهای چرب زنجیره‌کوتاه به سلامت ایمنی کمک می‌کنند. برای نتیجه‌ی پایدار، پروبیوتیک باید حداقل سه سویه فعال داشته باشد و همراه با فیبر محلول مصرف شود.",
        coverImageUrl:
            "https://images.boofshop.example/assets/blog-probiotic-bowl.jpg",
        tags: ["تغذیه", "پروبیوتیک"],
        isDraft: false,
        publishedAt: subDays(now, 3).toISOString(),
        createdAt: subDays(now, 9).toISOString(),
        updatedAt: subDays(now, 3).toISOString(),
    },
    {
        id: "post-joint-care-guide",
        producerId: "Boofshop",
        title: "برنامه ۳۰ روزه برای حمایت از مفاصل سگ",
        slug: "thirty-day-joint-support",
        excerpt:
            "از مکمل مناسب تا بازی‌های سبک؛ نکات کلیدی برای کاهش سفتی مفاصل و افزایش تحرک دوست پشمالوی شما.",
        contentMarkdown:
            "## عادات طلایی\n\nمصرف منظم گلوکزامین و کندرویتین همراه با حرکات کششی روزانه می‌تواند در چهار هفته دامنه حرکتی را بهبود دهد. تمرینات آبی سبک و کنترل وزن از اصلی‌ترین توصیه‌های دامپزشکان ما است.",
        coverImageUrl: "https://images.boofshop.example/assets/blog-joint-care.jpg",
        tags: ["حرکت", "سلامت"],
        isDraft: false,
        publishedAt: subDays(now, 11).toISOString(),
        createdAt: subDays(now, 18).toISOString(),
        updatedAt: subDays(now, 11).toISOString(),
    },
    {
        id: "post-calming-routine",
        producerId: "Boofshop",
        title: "آیین شبانه برای کاهش اضطراب سگ‌های حساس",
        slug: "nightly-calming-ritual",
        excerpt:
            "چهار گام ساده برای آماده کردن محیط خواب و کمک به سگ‌هایی که نسبت به صداهای ناگهانی واکنش نشان می‌دهند.",
        contentMarkdown:
            "## چهار گام آرامش‌بخش\n\nاز خاموش کردن صفحه‌نمایش‌ها تا استفاده از عطرآگین‌سازی ملایم؛ ایجاد ریتم ثابت قبل از خواب ترشح ملاتونین طبیعی را تقویت می‌کند. ماساژ ملایم شانه و قفسه سینه قبل از خواب، کیفیت استراحت را افزایش می‌دهد.",
        coverImageUrl: null,
        tags: ["رفتار", "آرامش"],
        isDraft: true,
        publishedAt: null,
        createdAt: subDays(now, 1).toISOString(),
        updatedAt: subDays(now, 1).toISOString(),
    },
];

export const mockBlogInsights: BlogInsightsSummary = {
    totalPosts: mockBlogPosts.length,
    publishedPosts: mockBlogPosts.filter((post) => !post.isDraft).length,
    draftPosts: mockBlogPosts.filter((post) => post.isDraft).length,
    lastPublishedAt:
        mockBlogPosts
            .filter((post) => post.publishedAt)
            .sort(
                (a, b) =>
                    new Date(b.publishedAt ?? 0).getTime() -
                    new Date(a.publishedAt ?? 0).getTime(),
            )[0]?.publishedAt ?? null,
};
