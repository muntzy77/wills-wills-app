export default function Hero() {
  return (
    <div className="card-soft w-full max-w-xl mx-auto p-8 space-y-5">
      <div className="badge-soft w-fit mx-auto">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Will-ready in under 15 minutes
      </div>
      <h2 className="text-4xl font-semibold leading-tight tracking-tight">
        Estate planning that feels
        <span className="bg-brand-100 text-brand-800 rounded-2xl px-2 ml-1">
          strangely easy.
        </span>
      </h2>
      <p className="text-neutral-600 text-sm">
        Will’s Wills turns the “I’ll do it later” document into a guided,
        AI-assisted flow. No dusty binders. No awkward phone calls. Just a
        calm, modern experience built for real life.
      </p>
    </div>
  );
}
