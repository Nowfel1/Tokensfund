import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track your swap",
  alternates: { canonical: "/track" },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
