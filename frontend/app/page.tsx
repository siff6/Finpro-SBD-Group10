import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Filter,
  KanbanSquare,
  Layers3,
  TableProperties,
} from "lucide-react";
import { LandingDashboardMockup } from "@/components/charts/landing-dashboard-mockup";
import { SiteHeader } from "@/components/layout/site-header";

const features = [
  {
    icon: ClipboardList,
    title: "Pelacakan Lamaran Terstruktur",
    body: "Kelola nama perusahaan, posisi, gaji, sumber lowongan, jenis kerja, dan status lamaran dalam satu tempat yang rapi.",
  },
  {
    icon: TableProperties,
    title: "Tabel Lamaran Interaktif",
    body: "Perbarui data lamaran dengan mudah melalui tabel yang ringan, jelas, dan nyaman digunakan tanpa tampilan yang membingungkan.",
  },
  {
    icon: BarChart3,
    title: "Analitik Rekrutmen",
    body: "Lihat ringkasan status lamaran, jumlah wawancara, dan perkembangan proses rekrutmen melalui visualisasi yang mudah dipahami.",
  },
  {
    icon: KanbanSquare,
    title: "Alur Status Lamaran",
    body: "Pantau status lamaran seperti Applied, Interviewed, Accepted, Rejected, dan Offer dengan tampilan yang konsisten.",
  },
  {
    icon: Layers3,
    title: "Aksi Lanjutan",
    body: "Catat tindakan berikutnya seperti follow up, persiapan wawancara, pengiriman email, atau keputusan akhir.",
  },
  {
    icon: Filter,
    title: "Filter dan Pemantauan",
    body: "Saring data berdasarkan status, tanggal lamaran, dan kebutuhan analisis agar proses pencarian kerja lebih terarah.",
  },
];

const metrics = [
  {
    label: "Rasio diterima",
    value: "28%",
    description: "Ringkasan hasil lamaran",
  },
  {
    label: "Jumlah wawancara",
    value: "11",
    description: "Lamaran yang masuk tahap lanjut",
  },
  {
    label: "Aksi terbuka",
    value: "17",
    description: "Tugas yang perlu ditindaklanjuti",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-slate-100 blur-3xl" />

          <div className="relative mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                Workspace pelacakan lamaran kerja
              </span>

              <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl">
                Kelola Lamaran Kerja dengan Lebih Rapi dan Terukur
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Applytics membantu Anda mencatat lamaran, memantau progres
                wawancara, menganalisis hasil rekrutmen, dan mengatur proses
                pencarian kerja dalam satu dashboard yang mudah digunakan.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Mulai Sekarang
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
                >
                  Buat Akun
                </Link>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                {["Data tersimpan rapi", "Dashboard ringan", "Analitik mudah dibaca"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-slate-900" />
                      <span>{item}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-3 shadow-xl shadow-slate-200/70">
              <LandingDashboardMockup />
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Fitur Utama
            </span>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Dirancang untuk membantu proses pencarian kerja menjadi lebih teratur
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Semua fitur dibuat agar data lamaran mudah dicatat, mudah dibaca,
              dan mudah dianalisis tanpa perlu mengatur spreadsheet secara manual.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/80"
                >
                  <span className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 transition group-hover:bg-slate-950 group-hover:text-white">
                    <Icon size={20} />
                  </span>

                  <h3 className="mt-5 text-lg font-semibold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Ringkasan Analitik
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                Pahami perkembangan lamaran dengan lebih jelas
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Grafik dan metrik membantu Anda melihat status lamaran, jumlah
                wawancara, serta tindakan lanjutan yang masih perlu diselesaikan.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                >
                  <span className="text-sm font-medium text-slate-600">
                    {metric.label}
                  </span>

                  <span className="mt-4 block text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                    {metric.value}
                  </span>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {metric.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Perbandingan
            </span>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ComparisonCard
                title="Spreadsheet Biasa"
                items={[
                  "Status lamaran diperbarui secara manual",
                  "Konteks proses rekrutmen sulit dipantau",
                  "Analitik perlu dibuat sendiri",
                  "Tindakan lanjutan sering bercampur dengan catatan lain",
                ]}
              />

              <ComparisonCard
                title="Applytics"
                items={[
                  "Data lamaran tersimpan dalam struktur yang jelas",
                  "Status dan aksi lanjutan mudah dipantau",
                  "Analitik tersedia langsung dari dashboard",
                  "Tampilan dibuat untuk penggunaan berulang",
                ]}
                highlighted
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function ComparisonCard({
  title,
  items,
  highlighted = false,
}: {
  title: string;
  items: string[];
  highlighted?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        highlighted
          ? "border-blue-200 bg-blue-50 text-slate-950 shadow-sm shadow-blue-100/80"
          : "border-slate-200 bg-slate-50 text-slate-950"
      }`}
    >
      <h3 className="text-xl font-semibold text-slate-950">
        {title}
      </h3>

      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-6 text-slate-600"
          >
            <CheckCircle2
              size={16}
              className={`mt-1 shrink-0 ${
                highlighted ? "text-blue-700" : "text-slate-800"
              }`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}