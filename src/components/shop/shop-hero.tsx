export function ShopHero() {
  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-amber-100/80 via-rose-50 to-white px-8 py-16 text-slate-900 shadow-[0_30px_80px_rgba(244,63,94,0.18)] dark:border-white/5 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <div className="absolute left-0 top-0 hidden h-full w-1/2 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.35),_transparent_55%)] md:block" />
      <div className="absolute bottom-[-120px] right-[-80px] h-[320px] w-[320px] rounded-full bg-gradient-to-br from-rose-200/60 to-amber-200/30 blur-3xl" />
      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs font-semibold tracking-[0.4em] text-rose-500 shadow-sm">
            فروشگاه
          </span>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            مراقبت روزانه از حیوان خانگی با محصولاتی که واقعاً کار می‌کنند
          </h1>
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">
            ترکیبی از مکمل‌های علمی، میان‌وعده‌های طبیعی و مراقبت‌های بهداشتی که
            برای نیازهای رایج سگ‌ها و گربه‌ها طراحی شده‌اند. همه چیز برای ایجاد یک
            روتین شاد و سالم به زبان و فرهنگ فارسی.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 font-semibold text-white">
              ارسال رایگان سفارش‌های بالای ۶۰۰ هزار تومان
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400 bg-white/80 px-4 py-2 font-semibold text-rose-600">
              ضمانت بازگشت ۳۰ روزه بدون قید و شرط
            </span>
          </div>
        </div>
        <div className="grid gap-4 text-right text-sm text-slate-600 dark:text-slate-200">
          <div className="rounded-3xl border border-white/40 bg-white/70 px-6 py-4 shadow-sm backdrop-blur">
            <p className="text-xs tracking-[0.35em] text-rose-400">
              روتین مورد علاقه
            </p>
            <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              روتین کامل مراقبت از مو و پوست
            </p>
            <p className="mt-2 leading-relaxed">
              شامپو و نرم‌کننده عمیق + اسپری تغذیه‌کننده برای درخشندگی روزانه.
            </p>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/70 px-6 py-4 shadow-sm backdrop-blur">
            <p className="text-xs tracking-[0.35em] text-rose-400">
              آمار جامعه
            </p>
            <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              بیش از ۲۵۰۰۰ خانواده راضی
            </p>
            <p className="mt-2 leading-relaxed">
              داستان‌های واقعی از حیوانات خانگی شاد که هر روز در شبکه‌های اجتماعی
              ما به اشتراک گذاشته می‌شود.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
