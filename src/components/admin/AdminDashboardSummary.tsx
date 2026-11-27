import Link from 'next/link';
import { ArrowUpRight, ClipboardCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { AdminDashboardData } from '@/types/dashboard';
import { DashboardStatus, Panel, dashboardOrderStatus, ghostButton } from '@/components/workspace/DashboardKit';

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });
const number = new Intl.NumberFormat('id-ID');

function LatestOrders({ orders }: { orders: AdminDashboardData['recent_orders'] }) {
  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold">Pesanan terbaru</h3>
        <Link href="/admin/orders" className={ghostButton}>Lihat pesanan <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
      </div>
      {orders.length ? (
        <table className="w-full table-fixed text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/70">
              <th scope="col" className="w-[55%] py-2.5 pr-2 font-semibold md:w-[37%]">Pesanan</th>
              <th scope="col" className="hidden w-[20%] py-2.5 pr-2 font-semibold md:table-cell">Waktu (WIB)</th>
              <th scope="col" className="w-[45%] py-2.5 pl-2 text-right font-semibold md:w-[23%]">Total</th>
              <th scope="col" className="hidden w-[20%] py-2.5 pl-2 text-right font-semibold md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders.map((order) => {
              const time = dateFormat.format(new Date(order.created_at));
              const orderStatus = dashboardOrderStatus[order.status] ?? { label: order.status };
              return (
                <tr key={order.id} className="align-top">
                  <th scope="row" className="py-3 pr-2 font-normal">
                    <div className="wrap-anywhere font-semibold">{order.order_number}</div>
                    <div className="mt-1 wrap-anywhere text-ink/70">{order.user.email}</div>
                    <time dateTime={order.created_at} className="mt-1 block text-ink/70 md:hidden">{time} WIB</time>
                  </th>
                  <td className="hidden py-3 pr-2 text-ink/70 md:table-cell"><time dateTime={order.created_at}>{time}</time></td>
                  <td className="py-3 pl-2 text-right">
                    <div className="wrap-anywhere font-semibold tabular-nums">{formatCurrency(order.total)}</div>
                    <div className="mt-1 md:hidden"><DashboardStatus {...orderStatus} /></div>
                  </td>
                  <td className="hidden py-3 pl-2 text-right md:table-cell"><DashboardStatus {...orderStatus} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : <p className="text-sm text-ink/70">Belum ada pesanan.</p>}
    </Panel>
  );
}

function PlatformTotals({ totals }: { totals: AdminDashboardData['totals'] }) {
  const items = [
    ['Akun pengguna', number.format(totals.users)],
    ['Organizer terdaftar', number.format(totals.organizers)],
    ['Total konser', number.format(totals.events)],
    ['Total pesanan lunas', number.format(totals.paid_orders)],
    ['Total pendapatan lunas', formatCurrency(totals.paid_revenue)],
  ];

  return (
    <Panel>
      <h3 className="mb-3 font-display text-lg font-bold">Total platform</h3>
      <dl className="divide-y divide-ink/10">
        {items.map(([label, value]) => (
          <div key={label} className="flex flex-wrap justify-between gap-x-2 gap-y-1 py-2 text-sm">
            <dt className="text-ink/75">{label}</dt>
            <dd className="wrap-anywhere font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <Link href="/admin/approvals" className="mt-3 flex min-h-11 items-center gap-3 rounded-xl border border-ink/10 bg-paper px-3 py-2 text-sm font-semibold hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze">
        <ClipboardCheck className="size-4 shrink-0" aria-hidden="true" />
        <span className="flex-1">{number.format(totals.pending_events)} menunggu persetujuan</span>
        <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
      </Link>
    </Panel>
  );
}

export default function AdminDashboardSummary({ totals, orders }: {
  totals: AdminDashboardData['totals'];
  orders: AdminDashboardData['recent_orders'];
}) {
  return (
    <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
      <LatestOrders orders={orders} />
      <PlatformTotals totals={totals} />
    </div>
  );
}
