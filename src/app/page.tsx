export default function Home() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-black/40 backdrop-blur-md">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent"
        />

        <div className="relative space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome to AsquareS
          </h1>
          <p className="text-2xl text-zinc-400 sm:text-2xl">
            This is the Staging / Dev !
          </p>
        </div>
      </div>
    </main>
  );
}
