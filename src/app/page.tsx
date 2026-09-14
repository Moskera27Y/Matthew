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
import { useAdminData } from "@/hooks/useAdminData";

export default function Home() {
  const { milestones, photos, growthRecords, brothers, familyMembers } =
    useAdminData();

  return (
    <>
      <Header />
      <main className="flex flex-col">
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
      </main>
      <ScrollToTop />
      <Footer />
    </>
  );
}
