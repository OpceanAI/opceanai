"use client";

import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BlueprintGrid from "@/components/background/BlueprintGrid";

export default function DesktopEffects() {
  return (
    <>
      <CustomCursor />
      <ScrollProgressBar />
      <BlueprintGrid variant="lines" opacity={0.02} size={48} className="fixed inset-0 -z-10 pointer-events-none" />
    </>
  );
}
