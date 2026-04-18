import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import type { MatchResponse } from "../types";

type MatchLocationState = {
  match: MatchResponse;
  context?: {
    hospitalName: string;
    bloodType: string;
    unitsNeeded: number;
    location: string;
  };
};

export function MatchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as MatchLocationState | null;

  useEffect(() => {
    if (!state?.match) {
      navigate("/hospital", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.match) {
    return (
      <div className="py-16 text-center text-text-muted">
        <p>Redirecting…</p>
      </div>
    );
  }

  const { match, context } = state;
  const { matchedDonors, count, message } = match;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Match results</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">{message}</p>
          {context && (
            <p className="mt-2 text-sm text-text">
              <span className="font-medium">{context.hospitalName}</span> · {context.bloodType} ·{" "}
              {context.unitsNeeded} unit{context.unitsNeeded === 1 ? "" : "s"} · {context.location}
            </p>
          )}
        </div>
        <Link to="/hospital">
          <Button variant="ghost">Back to dashboard</Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-muted">Eligible donors</p>
            <p className="text-3xl font-bold text-primary">{count}</p>
          </div>
          <Badge tone="urgent">Alert simulation</Badge>
        </div>
      </Card>

      {count === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-text">No eligible donors for this criteria</p>
            <p className="mt-2 text-sm text-text-muted">
              Try registering donors with the same blood type and exact location text, or wait until donation
              cooldowns expire (8 weeks).
            </p>
            <Link to="/hospital/register" className="mt-6 inline-block">
              <Button variant="accent">Register a donor</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {matchedDonors.map((d) => (
            <li key={d.id}>
              <Card className="h-full border-l-4 border-l-accent">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-text">{d.name}</p>
                    <p className="text-sm text-text-muted">{d.phone}</p>
                  </div>
                  <Badge tone="success">Eligible</Badge>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-text-muted">Blood</dt>
                    <dd className="font-medium text-text">{d.bloodType}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Location</dt>
                    <dd className="font-medium text-text">{d.location}</dd>
                  </div>
                </dl>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
