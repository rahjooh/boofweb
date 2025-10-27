export function ShopGuarantee() {
  return (
    <section className="rounded-[3rem] border border-white/10 bg-gradient-to-br from-rose-500 via-rose-400 to-amber-300 px-8 py-12 text-white shadow-[0_30px_90px_rgba(225,29,72,0.3)] dark:border-white/5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <h2 className="text-3xl font-black">ضمانت شادی حیوان خانگی</h2>
          <p className="max-w-2xl text-base leading-relaxed">
            اگر پس از ۳۰ روز تغییری در انرژی، خلق‌وخو یا سلامت حیوان خانگی خود
            احساس نکردید، تمام مبلغ پرداختی بدون سوال به شما بازگردانده می‌شود.
            تنها کافیست با تیم پشتیبانی ما تماس بگیرید.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-[2rem] bg-white/15 p-6 text-right text-sm font-semibold text-white/90">
          <p>پشتیبانی ۲۴ ساعته از طریق واتساپ و تلفن</p>
          <p>پیگیری تغییرات سلامت با چک لیست هفتگی</p>
          <p>بازگشت وجه کمتر از ۴۸ ساعت</p>
        </div>
      </div>
    </section>
  );
}
