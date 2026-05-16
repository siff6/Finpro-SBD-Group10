"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // ngecek tiket masuk di dompet browser
    const token = localStorage.getItem("applytics-token");
    if (!token) {
      // kalo ngga bawa, langsung diseret balik ke halaman login
      router.push("/login");
    } else {
      // kalo bawa, statusnya diizinin masuk
      setIsAuth(true);
    }
  }, [router]);
  // pas lagi ngecek, layarnya dikosongin dulu biar data dashboardmu ngga ngintip kelar
  if (!isAuth) {
    return null;
  }
  // pake Fragment <> biar ngga nambahin div pembungkus baru yang ngerusak layout aslimu
  return <>{children}</>;
}