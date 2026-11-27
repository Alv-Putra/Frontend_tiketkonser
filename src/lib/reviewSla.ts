export const REVIEW_SLA_HOURS = 72;
const HOUR = 3_600_000;

/** Batas review admin 3×24 jam sejak diajukan. */
export function reviewSla(submittedAt: string, now = Date.now()) {
  const total = REVIEW_SLA_HOURS * HOUR;
  const deadline = new Date(submittedAt).getTime() + total;
  const left = deadline - now;
  return {
    deadline: new Date(deadline),
    hoursLeft: Math.ceil(left / HOUR),
    overdue: left <= 0,
    elapsed: Math.min(1, Math.max(0, 1 - left / total)),
  };
}
