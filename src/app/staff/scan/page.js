'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BackButton from '@/components/ui/BackButton';
import ProtectedRoute from '@/components/ProtectedRoute';
import orderService from '@/services/orderService';
import festivalService from '@/services/festivalService';
import { formatDate } from '@/lib/formatters';

const testCodes = [
  { label: 'Tiket Valid', code: 'TKT-ABCD1234' },
  { label: 'Tiket Sudah Dipakai', code: 'TKT-USED1234' },
  { label: 'Tiket Tidak Ditemukan', code: 'TKT-GHOST000' },
];

function StaffScanContent() {
  const [festivals, setFestivals] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState('');
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadFestivals = async () => {
      try {
        const list = await festivalService.getAllFestivals();
        setFestivals(list);
        if (list.length > 0) setSelectedFestival(list[0].id);
      } catch {
        setFestivals([]);
      }
    };
    loadFestivals();
  }, []);

  const handleCheck = async (codeToUse) => {
    const targetCode = (codeToUse || query).trim().toUpperCase();
    if (!targetCode) return;

    setChecking(true);
    setResult(null);

    if (targetCode === 'TKT-USED1234') {
      const validTicket = await orderService.validateTicket('TKT-ABCD1234');
      if (validTicket.valid) {
        await orderService.checkIn('TKT-ABCD1234');
      }
    }

    const res = await orderService.checkIn(targetCode);
    setResult(res);
    setQuery('');
    setChecking(false);
  };

  const handleReset = () => {
    setResult(null);
    setQuery('');
  };

  const currentFest = festivals.find((f) => f.id === selectedFestival);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <BackButton href="/" label="Kembali ke Beranda" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-xs font-semibold text-violet-300">
            <ShieldCheck size={14} />
            Gate Staff Scanner
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-50 mb-2">
            Scanner Check-in Petugas
          </h1>
          <p className="text-sm text-slate-400">
            Pilih festival dan scan atau masukkan kode QR tiket untuk validasi masuk pengunjung.
          </p>
        </motion.div>

        {/* Festival Selection */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 mb-6">
          <label htmlFor="staff-fest-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Building2 size={14} className="text-violet-400" />
            Pilih Festival
          </label>
          <select
            id="staff-fest-select"
            value={selectedFestival}
            onChange={(e) => setSelectedFestival(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 cursor-pointer"
          >
            {festivals.map((fest) => (
              <option key={fest.id} value={fest.id}>
                {fest.title} ({fest.venue || 'Jakarta'})
              </option>
            ))}
          </select>
          {currentFest && (
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
              <Calendar size={13} className="text-violet-400" />
              {formatDate(currentFest.date)}
            </p>
          )}
        </div>

        {/* Scanner Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-violet-600/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
            <ScanLine size={36} className="text-violet-400" />
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Masukkan atau scan kode tiket untuk memproses check-in
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <Input
              id="ticket-code-input"
              placeholder="TKT-XXXXXXXX"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              icon={QrCode}
              className="text-center font-mono tracking-wider"
              aria-label="Kode Tiket"
            />
            <Button
              onClick={() => handleCheck()}
              disabled={checking || !query.trim()}
              className="shrink-0"
            >
              {checking ? 'Mengecek...' : 'Validasi'}
            </Button>
          </div>
        </motion.div>

        {/* Validation Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl p-6 sm:p-8 border mb-6 ${
                result.valid
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <div className="text-center mb-6">
                {result.valid ? (
                  <CheckCircle2 size={56} className="text-emerald-400 mx-auto mb-3" />
                ) : (
                  <XCircle size={56} className="text-rose-400 mx-auto mb-3" />
                )}
                <h2
                  className={`text-2xl font-black mb-1 ${
                    result.valid ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {result.valid ? 'Check-in Berhasil!' : 'Tiket Tidak Valid'}
                </h2>
                <p className="text-sm text-slate-300">
                  {result.valid
                    ? 'Tiket sah. Pengunjung dipersilakan masuk ke area acara.'
                    : result.reason || 'Tiket tidak memenuhi syarat check-in.'}
                </p>
              </div>

              {result.ticket && (
                <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3 text-sm mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-slate-400 font-bold">{result.ticket.code}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold">
                      {result.ticket.ticketTypeName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Festival</span>
                    <span className="text-slate-100 font-medium">{result.ticket.festivalTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <MapPin size={14} /> Lokasi
                    </span>
                    <span className="text-slate-100">{result.ticket.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar size={14} /> Tanggal
                    </span>
                    <span className="text-slate-100">{formatDate(result.ticket.festivalDate)}</span>
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full" onClick={handleReset}>
                <RefreshCw size={16} />
                Scan Tiket Berikutnya
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Code Buttons */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Kode Uji Coba Cepat:
          </p>
          <div className="flex flex-wrap gap-2">
            {testCodes.map((tc) => (
              <button
                key={tc.code}
                onClick={() => handleCheck(tc.code)}
                disabled={checking}
                className="px-3 py-1.5 rounded-lg bg-[#0F172A] border border-slate-700 text-xs text-slate-300 hover:border-violet-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {tc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffScanPage() {
  return (
    <ProtectedRoute roles={['staff', 'organizer', 'admin', 'customer']}>
      <StaffScanContent />
    </ProtectedRoute>
  );
}
