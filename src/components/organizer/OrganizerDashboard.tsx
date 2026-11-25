'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Banknote,
  Ticket,
  ShoppingBag,
  Music,
  QrCode,
  ClipboardList,
} from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import {
  DashboardFrame,
  DashboardHeader,
  DashboardLinks,
  DashboardNotice,
  RefreshButton,
  MetricGrid,
  Panel,
} from '@/components/workspace/DashboardKit';
import { useDashboardData } from '@/hooks/useDashboardData';
import OrganizerEventPicker from './OrganizerEventPicker';
import OrganizerEventSales from './OrganizerEventSales';
import { fetchOrganizerCharts } from '@/services/dashboardService';

import type { OrganizerChartData } from '@/types/dashboard';
import { formatCurrency } from '@/lib/formatters';

function SalesTrendChart({ chartData }: { chartData: OrganizerChartData }) {
  const [metricKey, setMetricKey] = useState<'gross_sales' | 'tickets_sold'>('gross_sales');
  const reduced = useReducedMotion();

  const chart = chartData.charts.sales_trend;
  const series = chart.series.find((s) => s.key === metricKey) ?? chart.series[0];
  const maxVal = Math.max(...(series?.data ?? [1]), 1);

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-base font-bold text-ink">Tren Penjualan</h2>
          <p className="text-xs text-ink/50">Grafik performa penjualan tiket terkini</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-paper p-1 text-xs">
          <button
            type="button"
            onClick={() => setMetricKey('gross_sales')}
            aria-pressed={metricKey === 'gross_sales'}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${
              metricKey === 'gross_sales'
                ? 'bg-blaze text-ink shadow-sm'
                : 'text-ink/60 hover:text-ink'
            }`}
          >
            Pendapatan
          </button>
          <button
            type="button"
            onClick={() => setMetricKey('tickets_sold')}
            aria-pressed={metricKey === 'tickets_sold'}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${
              metricKey === 'tickets_sold'
                ? 'bg-blaze text-ink shadow-sm'
                : 'text-ink/60 hover:text-ink'
            }`}
          >
            Tiket Terjual
          </button>
        </div>
      </div>

      {chart.labels.length === 0 || series.data.every((v) => v === 0) ? (
        <div className="flex h-44 items-center justify-center rounded-xl bg-paper text-xs text-ink/50">
          Belum ada transaksi di rentang waktu ini.
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex h-44 items-end gap-2 pt-6">
            {chart.labels.map((label, idx) => {
              const val = series.data[idx] ?? 0;
              const heightPct = Math.round((val / maxVal) * 100);
              const formattedVal =
                series.unit === 'IDR' ? formatCurrency(val) : `${val.toLocaleString('id-ID')} tiket`;

              return (
                <div key={label} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-8 z-10 hidden whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[10px] font-bold text-paper shadow-md group-hover:block">
                    {formattedVal} ({label})
                  </div>
                  {/* Bar */}
                  <m.div
                    initial={reduced ? false : { height: 0 }}
                    animate={{ height: `${Math.max(heightPct, 4)}%` }}
                    transition={{ duration: reduced ? 0 : 0.4, delay: idx * 0.02 }}
                    className={`w-full max-w-[28px] rounded-t-md transition-colors ${
                      val > 0 ? 'bg-blaze hover:bg-tangerine' : 'bg-ink/10'
                    }`}
                  />
                </div>
              );
            })}
          </div>
          {/* Label sumbu X */}
          <div className="flex gap-2 border-t border-ink/10 pt-2 text-[10px] text-ink/40">
            {chart.labels.map((label, idx) => {
              // Tampilkan label secukupnya agar tidak bertumpuk
              const show =
                chart.labels.length <= 10 ||
                idx === 0 ||
                idx === chart.labels.length - 1 ||
                idx % Math.ceil(chart.labels.length / 5) === 0;
              return (
                <div key={label} className="flex-1 text-center truncate">
                  {show ? label.slice(5) : ''}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Panel>
  );
}

function OrganizerExecutiveAnalytics({ interval }: { interval: 'day' | 'week' | 'month' }) {
  const { data: chartData, status, refresh } = useDashboardData(() => fetchOrganizerCharts({ interval }));


  if (!chartData && status !== 'error') {
    return <DashboardNotice>Memuat analitik penjualan…</DashboardNotice>;
  }

  if (status === 'error') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <DashboardNotice error>Analitik penjualan gagal dimuat.</DashboardNotice>
        <RefreshButton loading={false} refresh={refresh} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive KPI Cards */}
      <MetricGrid
        items={[
          {
            label: 'Penjualan Kotor',
            value: formatCurrency(chartData.summary.gross_sales.value),
            icon: Banknote,
            note:
              chartData.summary.gross_sales.change_pct !== null
                ? `${chartData.summary.gross_sales.change_pct >= 0 ? '+' : ''}${chartData.summary.gross_sales.change_pct}% dibanding periode lalu`
                : undefined,
          },
          {
            label: 'Tiket Terjual',
            value: `${chartData.summary.tickets_sold.value.toLocaleString('id-ID')} tiket`,
            icon: Ticket,
            note:
              chartData.summary.tickets_sold.change_pct !== null
                ? `${chartData.summary.tickets_sold.change_pct >= 0 ? '+' : ''}${chartData.summary.tickets_sold.change_pct}% dibanding periode lalu`
                : undefined,
          },
          {
            label: 'Pesanan Sukses',
            value: `${chartData.summary.paid_orders.value.toLocaleString('id-ID')} order`,
            icon: ShoppingBag,
            note:
              chartData.summary.paid_orders.change_pct !== null
                ? `${chartData.summary.paid_orders.change_pct >= 0 ? '+' : ''}${chartData.summary.paid_orders.change_pct}% dibanding periode lalu`
                : undefined,
          },
          {
            label: 'Status Dashboard',
            value: 'Live API',
            icon: TrendingUp,
            note: `Interval aktif: ${interval === 'day' ? 'Harian' : interval === 'week' ? 'Mingguan' : 'Bulanan'}`,
          },
        ]}
      />

      {/* Sales Trend Visualizer */}
      <SalesTrendChart chartData={chartData} />
    </div>
  );
}

export default function OrganizerDashboard({ salesOnly = false }: { salesOnly?: boolean }) {
  const [interval, setInterval] = useState<'day' | 'week' | 'month'>('day');

  return (
    <DashboardFrame>
      <DashboardHeader
        title={salesOnly ? 'Laporan Penjualan Tiket' : 'Dashboard Organizer'}
        subtitle={
          salesOnly
            ? 'Analisis pendapatan dan performa penjualan per konser musik.'
            : 'Ringkasan performa event, total penjualan, dan operasional tiket konser.'
        }
      >
        {!salesOnly && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1 text-xs">
              <button
                type="button"
                onClick={() => setInterval('day')}
                aria-pressed={interval === 'day'}
                className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                  interval === 'day' ? 'bg-blaze text-ink shadow-sm' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Harian
              </button>
              <button
                type="button"
                onClick={() => setInterval('week')}
                aria-pressed={interval === 'week'}
                className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                  interval === 'week' ? 'bg-blaze text-ink shadow-sm' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Mingguan
              </button>
              <button
                type="button"
                onClick={() => setInterval('month')}
                aria-pressed={interval === 'month'}
                className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                  interval === 'month' ? 'bg-blaze text-ink shadow-sm' : 'text-ink/60 hover:text-ink'
                }`}
              >
                Bulanan
              </button>
            </div>
          </div>
        )}
      </DashboardHeader>

      {!salesOnly && <OrganizerExecutiveAnalytics key={interval} interval={interval} />}


      {/* Rincian dan Penjualan Per Konser Terpilih */}
      <div className="pt-2">
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold text-ink">
            {salesOnly ? 'Pilih Konser untuk Analisis' : 'Monitoring Per Konser'}
          </h2>
          <p className="text-xs text-ink/60">
            Pilih salah satu konser untuk melihat rincian kelas tiket dan status kuota secara langsung.
          </p>
        </div>
        <OrganizerEventPicker>
          {(event) => <OrganizerEventSales key={event.id} event={event} />}
        </OrganizerEventPicker>
      </div>

      {!salesOnly && (
        <DashboardLinks
          items={[
            { label: 'Konser saya (Kelola & Ajukan)', href: '/organizer/concerts', icon: Music },
            { label: 'Kelola kelas tiket per konser', href: '/organizer/categories', icon: Ticket },
            { label: 'Laporan lengkap penjualan', href: '/organizer/sales', icon: ClipboardList },
            { label: 'Gerbang check-in QR tiket', href: '/organizer/checkin', icon: QrCode },
          ]}
        />
      )}
    </DashboardFrame>
  );
}
