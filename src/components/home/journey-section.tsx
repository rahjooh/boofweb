const steps = [
  {
    title: "مشاوره و آنالیز اولیه",
    description:
      "با پر کردن فرم آنلاین، اطلاعات سن، وزن و عادات غذایی سگ دریافت می‌شود و دامپزشک وضعیت را بررسی می‌کند.",
    badge: "گام اول",
  },
  {
    title: "طراحی بسته شخصی‌سازی شده",
    description:
      "بسته مکمل، دستورالعمل مصرف و برنامه یادآور ارسال می‌شود. امکان انتخاب طعم و محدودیت‌های غذایی وجود دارد.",
    badge: "گام دوم",
  },
  {
    title: "پیگیری مستمر و به‌روزرسانی",
    description:
      "کارشناسان تغذیه هر ماه تماس می‌گیرند تا پیشرفت وزن و انرژی سگ را ارزیابی کرده و در صورت نیاز تغییر ایجاد کنند.",
    badge: "گام سوم",
  },
];

export function JourneySection() {
  return (
    <section className="rounded-[32px] border border-amber-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 py-12 shadow-lg shadow-emerald-100/60 sm:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
          سفر سلامت از همین امروز شروع می‌شود
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          تنها در سه مرحله، برنامه تغذیه‌ای دقیق و قابل پیگیری برای سگ‌تان خواهید
          داشت.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.title}
            className="relative h-full rounded-3xl border border-emerald-100 bg-white/80 px-6 py-8 text-right shadow-sm shadow-emerald-100"
          >
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {step.badge}
            </span>
            <h3 className="mt-5 text-xl font-bold text-slate-900">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
