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
import AmbientBackground from "@/components/background/AmbientBackground";
import { useAdminData } from "@/hooks/useAdminData";

export default function Home() {
  const { milestones, photos, growthRecords, brothers, familyMembers, babyPhoto, event } =
    useAdminData();

  return (
    <>
      <Header />
      <main className="relative flex flex-col">
        <AmbientBackground />
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
