import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

function formatProductPrice(product: Product) {
  if (product.currency === "USD") {
    const tomanValue = Math.round(product.price * 60000);
    return formatCurrency(tomanValue, "IRR");
  }

  return formatCurrency(product.price, product.currency ?? "IRR");
}

export function ProductShowcase({ products }: { products: Product[] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="rounded-[32px] border border-white/80 bg-white/90 px-6 py-12 shadow-xl shadow-amber-100/60 sm:px-10">
      <div className="flex flex-col gap-4 text-right sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            محبوب‌ترین محصولات اشتراکی
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            مکمل‌های پروبیوتیک، پودرهای مراقبت از مفاصل و میان‌وعده‌های کم‌چرب که
            مورد تایید دامپزشکان شبکه بوف  است.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-white"
        >
          مشاهده همه محصولات
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="relative flex h-full flex-col rounded-3xl border border-amber-100 bg-amber-50/70 p-6 shadow-sm shadow-amber-200"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">
                {product.name}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {product.description ||
                  "فرمولاسیون ویژه برای حمایت از شادابی و ایمنی سگ‌های خانگی."}
              </p>
            </div>
            <dl className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-700">
              <div>
                <dt className="text-xs text-slate-500">قیمت اشتراک ماهانه</dt>
                <dd className="mt-1 text-lg font-extrabold text-slate-900">
                  {formatProductPrice(product)}
                </dd>
              </div>
              <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-emerald-600">
                {product.stock && product.stock > 0
                  ? "ارسال فوری"
                  : "تولید محدود"}
              </div>
            </dl>
            <Link
              href={`/products/${product.id}`}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              شروع برنامه تغذیه
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
