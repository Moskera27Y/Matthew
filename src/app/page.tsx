// src/app/page.tsx
"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/hero/Hero";
import Timeline from "@/components/timeline/Timeline";
import Gallery from "@/components/gallery/Gallery";
import GrowthSection from "@/components/growth/GrowthSection";
import SiblingsSection from "@/components/brothers/SiblingsSection";
import FamilySection from "@/components/family/FamilySection";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ShareSection from "@/components/share/ShareSection";
import { useAdminData } from "@/hooks/useAdminData";

export default function Home() {
  const { milestones, photos, growthRecords, brothers, familyMembers, babyPhoto, event } =
    useAdminData();

  return (
    <>
      <Header />
      <main className="relative flex flex-col">
        {/* Fondo ambiental fijo: blobs de color que unen toda la página */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-fuchsia-200/25 blur-[100px] animate-float-slow" />
          <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-amber-200/25 blur-[100px] animate-float-slow" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-sky-200/25 blur-[100px] animate-float-slow" style={{ animationDelay: "4s" }} />
        </div>
        <div className="relative z-10 flex flex-col">
        <Hero />
        <SectionDivider variant="wave" />

        <Timeline milestones={milestones} />
        <SectionDivider variant="dots" />
        <Gallery photos={photos} />
        <SectionDivider variant="line" />
        <GrowthSection records={growthRecords} />
        <SectionDivider variant="wave" />
        <SiblingsSection brothers={brothers} />
        <SectionDivider variant="dots" />
        <FamilySection members={familyMembers} />
        <SectionDivider variant="wave" />
        <ShareSection babyPhoto={babyPhoto} event={event} />
        </div>
      </main>
      <ScrollToTop />
      <Footer />
    </>
  );
}
