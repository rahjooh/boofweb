const benefits = [
  {
    title: "پشتیبانی دامپزشکی اختصاصی",
    description:
      "با خرید هر محصول به چت رایگان با دامپزشکان معتمد ما دسترسی پیدا می‌کنید تا سوالات روزمره خود را بپرسید.",
  },
  {
    title: "مواد اولیه باکیفیت جهانی",
    description:
      "مکمل‌ها و خوراکی‌ها با مواد اولیه تایید شده در اروپا و آمریکا تهیه شده‌اند و دارای گواهی استاندارد جهانی هستند.",
  },
  {
    title: "تحویل سریع در سراسر ایران",
    description:
      "انبارهای ما در تهران و اصفهان سفارش‌ها را در کمتر از ۴۸ ساعت به درب منزل شما می‌رسانند.",
  },
  {
    title: "اشتراک ماهانه منعطف",
    description:
      "با فعال‌سازی اشتراک، محصولات ضروری حیوان خانگی شما هر ماه بدون دغدغه ارسال می‌شود و می‌توانید هر زمان آن را لغو کنید.",
  },
];

export function ShopBenefits() {
  return (
    <section className="rounded-[3rem] border border-white/10 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/5 dark:bg-slate-950/70">
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          چرا خانواده‌های ایرانی ما را انتخاب می‌کنند؟
        </h2>
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-200">
          ما تجربهٔ فروشگاهی الهام‌گرفته از بهترین برندهای جهانی را با نیازهای
          محلی ترکیب کرده‌ایم. هر مرحله از خرید از انتخاب محصول تا پس از ارسال با
          دقت و عشق طراحی شده است.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-[2rem] border border-rose-100/70 bg-gradient-to-br from-white via-rose-50 to-amber-50 p-6 text-right shadow-[0_20px_40px_rgba(248,113,113,0.1)] transition hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(248,113,113,0.15)] dark:border-white/10 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950"
          >
            <h3 className="text-xl font-bold text-rose-500 dark:text-rose-300">
              {benefit.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-200">
              {benefit.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
