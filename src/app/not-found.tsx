import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
        <Compass className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold font-heading text-foreground">
        404 — Page Not Found
      </h2>
      <p className="text-xs text-muted-foreground max-w-md">
        The requested pathway or intelligence resource could not be found within the CareerIS directory.
      </p>
      <Button asChild size="sm">
        <Link href="/">Return to CareerIS Home</Link>
      </Button>
    </div>
  );
}
