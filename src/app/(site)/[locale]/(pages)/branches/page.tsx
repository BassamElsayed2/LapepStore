import Branches from "@/components/Branches";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "branches" });

  return {
    title: locale === "ar" ? `الفروع | متجر لابيب` : `Branches | Lapep Store`,
    description:
      locale === "ar"
        ? "اكتشف فروع متجر لابيب في جميع أنحاء المملكة - مواقعنا وعناويننا وأوقات العمل"
        : "Discover Lapep Store branches across the kingdom - our locations, addresses, and working hours",
  };
}

const BranchesPage = () => {
  return (
    <main>
      <Branches />
    </main>
  );
};

export default BranchesPage;
