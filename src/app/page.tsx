import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import WhatIs from "@/components/sections/WhatIs";
import Origin from "@/components/sections/Origin";
import Discovery from "@/components/sections/Discovery";
import LabEra from "@/components/sections/LabEra";
import Breakthrough from "@/components/sections/Breakthrough";
import Ecosystem from "@/components/sections/Ecosystem";
import Doki from "@/components/sections/Doki";
import ASL from "@/components/sections/ASL";
import Research from "@/components/sections/Research";
import Closing from "@/components/sections/Closing";
import Footer from "@/components/sections/Footer";
import DetailView from "@/components/sections/details/DetailView";
import AtmosphericBg from "@/components/background/AtmosphericBg";
import LiquidFilters from "@/components/svg/LiquidFilters";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <LiquidFilters />
      <AtmosphericBg />
      <Navigation />
      <div className="w-full max-w-7xl mx-auto">
        <Hero />
        <WhatIs />
        <Origin />
        <Discovery />
        <LabEra />
        <Breakthrough />
        <Ecosystem />
        <Doki />
        <ASL />
        <Research />
        <Closing />
        <Footer />
        <DetailView />
      </div>
    </main>
  );
}
