import { Link } from "react-router-dom";
import { Button } from "../components/Button";

function IconDroplet({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMap({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconHospital({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const features = [
  {
    icon: IconDroplet,
    title: "Match by blood type",
    text: "Emergencies are filtered by the type you can safely give, so alerts stay relevant.",
  },
  {
    icon: IconMap,
    title: "Location-aware",
    text: "We pair need and availability using the area you list — clear, simple geography for dispatch.",
  },
  {
    icon: IconHospital,
    title: "Hospital coordination",
    text: "Verified staff can log requests, search the donor pool, and run matches from one console.",
  },
] as const;

export function Landing() {
  return (
    <div className="w-full">
      <section
        className="relative overflow-hidden border-b border-black/5 bg-gradient-to-b from-primary/[0.07] via-background to-surface"
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 md:pb-28 md:pt-20 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">Ethiopia</p>
          <h1
            id="hero-heading"
            className="mx-auto mt-4 max-w-3xl text-center text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl md:text-5xl"
          >
            Connect donors and hospitals when minutes matter
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-text-muted sm:text-lg">
            HemoLink helps align blood type, place, and readiness so emergency response teams can reach the right donors
            faster. Join the pool or explore the directory — hospitals sign in to coordinate requests.
          </p>

          <div className="mx-auto mt-10 flex max-w-lg flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link to="/register" className="inline-flex sm:min-w-[200px]">
              <Button variant="primary" className="min-h-[48px] w-full px-8 text-base shadow-md">
                Register as a donor
              </Button>
            </Link>
            <Link to="/donors" className="inline-flex sm:min-w-[200px]">
              <Button variant="secondary" className="min-h-[48px] w-full px-8 text-base">
                Browse donor directory
              </Button>
            </Link>
            <Link to="/admin" className="inline-flex sm:min-w-[200px]">
              <Button variant="ghost" className="min-h-[48px] w-full border-2 border-secondary/25 px-8 text-base text-secondary hover:border-secondary/40 hover:bg-secondary/5">
                Hospital & admin sign in
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-text-muted">
            Prototype for research and demonstration — not for clinical decisions.
          </p>
        </div>
      </section>

      <section className="border-b border-black/5 bg-background py-14 sm:py-16" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="features-heading" className="text-center text-sm font-semibold uppercase tracking-wide text-primary">
            How it works
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-xl font-bold text-secondary">Built for clarity under pressure</p>

          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {features.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="rounded-2xl border border-black/5 bg-surface/80 p-6 shadow-sm transition hover:border-secondary/15 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gradient-to-r from-secondary/10 via-primary/5 to-accent/10 py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-lg font-semibold text-secondary md:text-xl">Ready to add your name to the donor pool?</p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">
            It only takes a minute. You can browse all public listings anytime without an account.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link to="/register" className="inline-flex">
              <Button variant="accent" className="min-h-[48px] px-8 text-base shadow-md">
                Start donor registration
              </Button>
            </Link>
            <Link to="/donors" className="text-sm font-semibold text-secondary underline-offset-4 hover:underline">
              View directory first →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
