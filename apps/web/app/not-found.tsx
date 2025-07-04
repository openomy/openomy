"use client";

import { Waitlist } from "@/components/waitlist";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 mx-auto w-full max-w-6xl px-4 lg:px-8 py-6 space-y-6">
        <div className="px-6 py-6 rounded-xl border text-card-foreground shadow font-semibold">
          Your repository has not been synchronized yet. To access all features,
          please join our waitlist.
        </div>
        <Waitlist />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8 py-6">
        <Footer />
      </div>
    </div>
  );
}
