const testimonials = [
  {
    name: "ترانه از تهران",
    quote:
      "بعد از سه ماه استفاده از پودر مفصل بوف ، لرد دوباره بدون درد از پله‌ها بالا می‌رود. پشتیبانی تلفنی عالی بود.",
  },
  {
    name: "محمد از شیراز",
    quote:
      "برنامه اشتراکی باعث شد یادم نرود مکمل‌ها را تهیه کنم. طعم ارده‌ای پروبیوتیک را حتی سگ بدغذا هم دوست دارد.",
  },
  {
    name: "مهسا از کرج",
    quote:
      "کیت خوش‌خوراک‌های دندانی واقعاً بوی دهان را کاهش داد. دستورالعمل فارسی دقیق بود و یادآورها خیلی کمک کرد.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="rounded-[32px] border border-rose-100 bg-rose-50/60 px-6 py-12 shadow-lg shadow-rose-100/50 sm:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
          خانواده‌های ما چه می‌گویند؟
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          امتیاز رضایت ۴.۸ از ۵، حاصل همراهی واقعی با خانواده‌های سگ‌دوست در سراسر
          ایران است.
        </p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="rounded-3xl border border-rose-100 bg-white/90 p-6 text-right shadow-sm shadow-rose-100"
          >
            <blockquote className="text-sm leading-relaxed text-slate-600">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-4 text-xs font-semibold text-rose-600">
              {testimonial.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
