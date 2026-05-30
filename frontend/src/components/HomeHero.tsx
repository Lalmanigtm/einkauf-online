import { Link } from "react-router";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

export function HomeHero({ categories, loadingCategories }) {
  return (
    <section className="relative w-full overflow-hidden rounded-box border border-base-300 bg-gradient-to-br from-base-100 via-base-100 to-primary/10 shadow-lg">
      {/* Glow */}
      <div
        className="absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8 md:p-12 lg:p-14">
        {/* LEFT SIDE */}
        <div className="min-w-0">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Hardware & workspace,{" "}
            <span className="text-primary">ready to ship</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-8 text-base-content/70">
            Audio, wearables, workspace, and travel—curated for work and home.
            Secure checkout; after payment, use your order page for support chat
            and video.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalog" className="btn btn-primary gap-2 shadow-md">
              Shop catalog
              <ArrowRightIcon className="size-5" />
            </a>

            <Link to="/cart" className="btn btn-outline btn-primary">
              View cart
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="stat rounded-box border border-base-300 bg-base-100/80 shadow-sm">
            <div className="stat-title">Categories</div>

            <div className="stat-value text-primary">
              {loadingCategories ? (
                <span className="skeleton inline-block h-8 w-10 rounded" />
              ) : (
                categories.length
              )}
            </div>

            <div className="stat-desc">Curated groups</div>
          </div>

          <div className="rounded-box border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <SparklesIcon className="size-4 text-primary" />
              Secure checkout · Priority support on paid orders
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
