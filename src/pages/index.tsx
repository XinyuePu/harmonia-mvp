import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import translations from "../../i18n"; // 确保路径正确

const Chat = dynamic(() => import("../../components/Chat"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [locale, setLocale] = useState<keyof typeof translations>("en");

  useEffect(() => {
    if (router.locale && translations[router.locale as keyof typeof translations]) {
      setLocale(router.locale as keyof typeof translations);
    }
  }, [router.locale]);

  const t = translations[locale] ?? translations["en"];

  return (
    <div>
      <Chat />
    </div>
  );
}