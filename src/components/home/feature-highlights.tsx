const features = [
  {
    title: "فرمولاسیون علمی و بومی",
    description:
      "ترکیبات توسط دامپزشکان داخلی و بر اساس مواد اولیه در دسترس در ایران طراحی شده تا سیستم گوارشی حساس سگ‌ها تقویت شود.",
    icon: "M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5",
  },
  {
    title: "ارسال منظم و انعطاف‌پذیر",
    description:
      "برنامه اشتراکی قابل تنظیم است؛ هر زمان که نیاز داشته باشید می‌توانید ارسال بعدی را جلو یا عقب بیندازید.",
    icon: "M4 7h16M4 12h12M4 17h8",
  },
  {
    title: "پشتیبانی دامپزشکی دائمی",
    description:
      "پس از ثبت سفارش، مشاور تغذیه با شما تماس می‌گیرد تا وضعیت سگ بررسی و برنامه شخصی‌سازی شود.",
    icon: "M12 21c6 0 9-5 9-9a9 9 0 10-18 0c0 4 3 9 9 9zm0-6a3 3 0 110-6 3 3 0 010 6z",
  },
];

export function FeatureHighlights() {
  return (
    <section className="rounded-[32px] border border-amber-100 bg-white/80 px-6 py-12 shadow-lg shadow-amber-100/50 sm:px-10">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
          چرا بوف  را انتخاب کنیم؟
        </h2>
        <p className="mt-4 text-base text-slate-600">
          ترکیب هوشمند علوم تغذیه حیوانات خانگی با سبک زندگی خانواده‌های ایرانی،
          تجربه‌ای شبیه یک کلینیک خانگی برای سگ‌ها ایجاد کرده است.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-3xl border border-amber-100 bg-amber-50/80 px-6 py-8 text-right shadow-sm shadow-amber-100"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-white p-3 shadow">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-emerald-600"
                role="img"
                aria-label={feature.title}
              >
                <title>{feature.title}</title>
                <path
                  d={feature.icon}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
