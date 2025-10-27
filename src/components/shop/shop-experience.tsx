export function ShopExperience() {
  return (
    <section className="grid gap-10 rounded-[3rem] border border-white/10 bg-white/80 p-8 shadow-[0_20px_70px_rgba(244,114,182,0.12)] lg:grid-cols-[1.2fr_1fr] dark:border-white/5 dark:bg-slate-950/70">
      <div className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-rose-500 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-100">
          تجربه اشتراک
        </span>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          روتین ماهانه بسازید و هرگز نگران تمام شدن محصولات ضروری نباشید
        </h2>
        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-200">
          مدل اشتراک پویا به شما اجازه می‌دهد زمان ارسال، تعداد و طعم محصولات را
          شخصی‌سازی کنید. تغییر یا توقف اشتراک تنها با یک کلیک انجام می‌شود و قبل
          از ارسال هر بسته یک پیامک تایید برای شما ارسال خواهد شد.
        </p>
        <ul className="grid gap-4 text-sm text-slate-600 dark:text-slate-200 sm:grid-cols-2">
          <li className="flex items-center gap-3 rounded-2xl border border-rose-100/70 bg-white/70 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white">
              ۱
            </span>
            انتخاب ترکیب محصولات متناسب با نیاز حیوان خانگی
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-rose-100/70 bg-white/70 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white">
              ۲
            </span>
            تعیین فاصله ارسال و یادآوری‌های شخصی‌سازی‌شده
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-rose-100/70 bg-white/70 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white">
              ۳
            </span>
            دریافت بسته‌بندی پایدار با پیام اختصاصی هر ماه
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-rose-100/70 bg-white/70 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white">
              ۴
            </span>
            دسترسی به تخفیف ویژه اعضای باشگاه تا ۲۰٪
          </li>
        </ul>
      </div>
      <div className="relative flex flex-col items-center justify-between gap-6 rounded-[2.5rem] border border-rose-100/60 bg-gradient-to-br from-rose-100 via-amber-50 to-white p-8 text-center text-slate-700 shadow-[0_20px_60px_rgba(248,113,113,0.18)] dark:border-white/10 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950 dark:text-slate-100">
        <div>
          <h3 className="text-2xl font-black text-rose-500 dark:text-rose-300">
            هدیه خوش‌آمد عضویت
          </h3>
          <p className="mt-3 text-sm leading-relaxed">
            در اولین اشتراک ۱۵٪ تخفیف دریافت کنید و یک اسباب‌بازی دست‌ساز ایرانی
            به صورت رایگان همراه بسته ارسال می‌شود.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">مزایای ویژه اعضا:</p>
          <ul className="space-y-2 text-right">
            <li>• اولویت در دسترسی به محصولات جدید</li>
            <li>• چکاپ آنلاین فصلی با کارشناس تغذیه</li>
            <li>• باشگاه امتیاز قابل استفاده در خریدهای بعدی</li>
          </ul>
        </div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
        >
          شروع اشتراک ماهانه
        </button>
      </div>
    </section>
  );
}
