import Contact from "@/components/Contact";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title:
      locale === "ar"
        ? `صفحة الاتصال | متجر لابيب`
        : `Contact Page | Lapep Store`,
    description:
      locale === "ar"
        ? "صفحة الاتصال لمتجر لابيب - تواصل معنا للحصول على المساعدة والدعم"
        : "Contact page for Lapep Store - Get in touch with us for help and support",
  };
}

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
