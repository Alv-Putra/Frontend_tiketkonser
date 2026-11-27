import { REVIEW_SLA_HOURS, reviewSla } from '../reviewSla';

const submitted = '2026-11-20T00:00:00.000Z';
const at = (hours: number) => new Date(submitted).getTime() + hours * 3_600_000;

test('menghitung batas 3×24 jam dan sisa waktunya', () => {
  const sla = reviewSla(submitted, at(24));
  expect(REVIEW_SLA_HOURS).toBe(72);
  expect(sla.deadline.toISOString()).toBe('2026-11-23T00:00:00.000Z');
  expect(sla).toMatchObject({ hoursLeft: 48, overdue: false });
  expect(sla.elapsed).toBeCloseTo(1 / 3);
});

test('menandai lewat batas dan membatasi progres 0–1', () => {
  expect(reviewSla(submitted, at(80))).toMatchObject({ hoursLeft: -8, overdue: true, elapsed: 1 });
  expect(reviewSla(submitted, at(-5)).elapsed).toBe(0);
  expect(reviewSla(submitted).overdue).toBe(true);
});
