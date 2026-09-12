"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { StatePage } from "@/components/StatePage";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatePage
      icon={<RefreshCw size={26} strokeWidth={1.8} />}
      eyebrow="Something went sideways"
      title="A small bump in the road."
      description="Something didn't load as expected. Try again, or head back to your workspace."
      actions={
        <>
          <Button onClick={reset}>
            <RefreshCw /> Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back home</Link>
          </Button>
        </>
      }
    />
  );
}
