import BentoSection from "@/components/sections/bento"
import CallToAction from "@/components/sections/cta"
import HeroSection from "@/components/sections/hero"
import PricingSection from "@/components/sections/pricing"

export default function Page() {
  return (
    <div className="flex flex-col min-h-svh font-[family-name:var(--font-geist-sans)]">
      <div
        className="absolute inset-0 -z-10 h-full w-full 
        bg-[radial-gradient(#515151_1px,transparent_1px)] 
        dark:bg-[radial-gradient(#9494a8_0.8px,transparent_1px)] 
        [background-size:24px_24px] 
        [mask-image:radial-gradient(ellipse_100%_50%_at_50%_30%,#000_5%,transparent_100%)]
        opacity-50"
      ></div>
      <HeroSection />
      <BentoSection />
      <PricingSection />
      <CallToAction />
    </div>
  )
}
