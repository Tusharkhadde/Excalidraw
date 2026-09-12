import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatePage } from "@/components/StatePage";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StatePage
      icon={
        <span className="size-8 text-primary">
          <BrandMark glyphOnly />
        </span>
      }
      eyebrow="404 / Outside the lines"
      title="This page is a blank canvas."
      description="We couldn't find what you're looking for. Let's get you back to a little inspiration."
      actions={
        <>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft /> Back home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/canvas/guest">Start drawing</Link>
          </Button>
        </>
      }
    />
  );
}
