import Link from "next/link";

export function MembershipBanner({ producerId }: { producerId: string }) {
  return (
    <section
      id="membership"
      className="rounded-[32px] border border-emerald-100 bg-emerald-600 px-6 py-12 text-white shadow-xl shadow-emerald-200 sm:px-10"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
        <span className="mx-auto inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-1 text-xs font-semibold">
          باشگاه همسفران سلامت
        </span>
        <h2 className="text-3xl font-black leading-tight sm:text-4xl">
          با اشتراک طلایی، هر ماه کیت مخصوص نیاز سگ‌تان را دریافت کنید
        </h2>
        <p className="text-sm leading-relaxed text-emerald-50">
          ۱۰٪ تخفیف دائمی، یک جلسه رایگان گفتگوی آنلاین با دامپزشک و گزارش
          تحلیلی رشد به صورت PDF در هر دوره برای اعضای باشگاه ارسال می‌شود.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/store/${producerId}/blog`}
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            عضویت و دریافت هدیه خوش‌آمد
          </Link>
          <Link
            href="/account"
            className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            ورود اعضای فعلی
          </Link>
        </div>
      </div>
    </section>
  );
}
