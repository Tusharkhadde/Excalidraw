import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatePageProps {
  icon: React.ReactNode;
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  iconClassName?: string;
}

/** Full-screen status card used for loading, auth-gate, error and 404 states. */
export function StatePage({ icon, eyebrow, title, description, actions, iconClassName }: StatePageProps) {
  return (
    <main className="dot-grid grid min-h-svh place-items-center bg-background p-6">
      <Card className="w-full max-w-md animate-scale-in p-8 text-center shadow-lift sm:p-10">
        <div className={cn("mx-auto grid size-14 place-items-center overflow-hidden rounded-2xl bg-primary/10 text-primary", iconClassName)}>
          {icon}
        </div>
        {eyebrow && <span className="eyebrow mt-6 justify-center">{eyebrow}</span>}
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="prose-muted mt-3 text-sm">{description}</p>}
        {actions && <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>}
      </Card>
    </main>
  );
}
