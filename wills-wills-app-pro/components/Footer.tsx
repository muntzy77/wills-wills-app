export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white/60 mt-8">
      <div className="max-w-4xl mx-auto py-6 px-6 text-[11px] text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Will’s Wills. All rights reserved.</p>
        <p>Not legal advice. For complex situations, speak to a solicitor.</p>
      </div>
    </footer>
  );
}
