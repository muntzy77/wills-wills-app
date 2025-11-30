import Hero from "@/components/Hero";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-10">
      <Hero />

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button href="/paywall">Start Your Will</Button>
        <Button href="/dashboard" variant="ghost">
          Preview Builder
        </Button>
      </div>

      <p className="text-neutral-500 text-sm max-w-md">
        No paperwork. No legal jargon. Just a guided, modern experience that
        feels more like a lifestyle app than a law firm.
      </p>
    </div>
  );
}
