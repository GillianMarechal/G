import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Announcement from "@/components/announcement";

async function getMessages(locale: string) {
  try {
    return (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Announcement />
      {children}
    </NextIntlClientProvider>
  );
}
