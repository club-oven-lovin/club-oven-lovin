import Link from "next/link";
import { HeroImageSlider } from "./HeroImageSlider";

const heroImages = [
  {
    src: "/images/hero-toaster-1.jpeg",
    alt: "Toaster oven sheet pan pizzas with toppings",
  },
  {
    src: "/images/hero-toaster-2.jpeg",
    alt: "Simple roasted vegetables cooked in a toaster oven",
  },
];

type HeroSectionProps = {
  className?: string;
};

export function HeroSection({ className }: 
HeroSectionProps) {
  const creamColor = '#fff8f1'
  
  return (
    <section
      className={`w-full py-16 px-6 md:px-10 ${className ?? ""}`}
      style={{ backgroundColor: creamColor }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="order-2 space-y-6 text-slate-800 md:order-1 md:flex-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            Toaster Oven Recipes for Students
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Healthy, Affordable Meals with Just a Toaster Oven
          </h1>
          <p className="text-lg text-slate-600 md:text-xl">
            Discover delicious recipes designed for college students with
            limited kitchens, tight budgets, and busy schedules.
          </p>
          <ul className="space-y-3 text-base text-slate-700">
            {[
              "Toaster oven-friendly recipes",
              "Price breakdowns per serving",
              "Ingredients available near UH campus",
              "Plus filters (vegan, gluten-free, etc.)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-orange-600"
            >
              Sign In to Start Cooking
            </Link>
            <Link
              href="/recipes"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
            >
              Browse Recipes
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2 md:flex-1 md:pl-4">
          <div className="mx-auto w-full max-w-md">
            <HeroImageSlider images={heroImages} />
          </div>
        </div>
      </div>
    </section>
  );
}
