import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Capabilities from "@/components/sections/Capabilities";
import Ecosystem from "@/components/sections/Ecosystem";
import Doki from "@/components/sections/Doki";
import ASL from "@/components/sections/ASL";
import Research from "@/components/sections/Research";
import Closing from "@/components/sections/Closing";
import Footer from "@/components/sections/Footer";
import DetailView from "@/components/sections/details/DetailView";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <Navigation />
      <Hero />
      <Capabilities />
      <Ecosystem />
      <Doki />
      <ASL />
      <Research />
      <Closing />
      <Footer />
      <DetailView />
    </main>
  );
}
