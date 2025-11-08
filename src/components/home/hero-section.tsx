import Link from "next/link";

const heroStats = [
  { label: "خانواده‌های عضو", value: "۲۵٬۰۰۰+" },
  { label: "سگ‌های خوشحال", value: "۹۸٪ رضایت" },
  { label: "زمان ارسال", value: "تحویل ۲۴ ساعته تهران" },
];

export function HeroSection({ producerId }: { producerId: string }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-amber-50 via-white to-rose-50 px-8 py-16 shadow-xl shadow-amber-200/40 sm:px-12 lg:px-16">
      <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/50 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center text-slate-900">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
          <span
            className="inline-block h-2 w-2 rounded-full bg-emerald-500"
            aria-hidden
          />
          نسخه‌های تخصصی برای سگ‌های خانگی ایران
        </span>
        <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
          تغذیه علمی و خوش‌خوراک برای دوست پشمالوی شما
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
          در بوف ، مکمل‌ها و میان‌وعده‌هایی کاملاً متناسب با اقلیم و سبک
          زندگی ایرانی طراحی کرده‌ایم. هر بسته با راهنمای تغذیه فارسی، پشتیبانی
          دامپزشکی و ارسال منظم همراه است.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="rounded-full bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
          >
            مشاهده محصولات
          </Link>
          <Link
            href={`/store/${producerId}/blog`}
            className="rounded-full border border-slate-300 px-8 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-white"
          >
            دریافت برنامه تغذیه رایگان
          </Link>
        </div>
        <dl className="mt-12 grid w-full gap-6 text-sm sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/60 bg-white/70 px-6 py-4 shadow-sm shadow-amber-100"
            >
              <dt className="text-xs font-medium text-slate-500">
                {stat.label}
              </dt>
              <dd className="mt-2 text-2xl font-extrabold text-slate-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
