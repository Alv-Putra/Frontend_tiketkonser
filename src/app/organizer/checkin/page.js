'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ScanLine, CheckCircle2, XCircle, MapPin, Calendar, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import orderService from '@/services/orderService';
import { formatDate } from '@/lib/formatters';

const testCodes = [
  { label: 'Tiket valid', code: 'TKT-ABCD1234' },
  { label: 'Tiket sudah dipakai', code: 'TKT-USED1234' },
  { label: 'Tiket tidak ditemukan', code: 'TKT-GHOST000' },
];

function CheckInContent() {
  const [codes, setCodes] = useState([]);
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (code) => {
    setChecking(true);
    setResult(null);
    let targetCode = code || query;
    if (codes.length === 0 && targetCode === 'TKT-USED1234') {
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

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black mb-2">
          <span className="text-gradient">Check-in Tiket</span>
        </h1>
        <p className="text-text-muted text-sm">
          Scan atau masukkan QR Code tiket untuk validasi masuk festival.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-secondary-accent/5 via-secondary-bg to-primary-accent/5 border border-border rounded-[24px] p-8 text-center mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-primary-accent/10 flex items-center justify-center mx-auto mb-4">
          <ScanLine size={36} className="text-primary-accent" />
        </div>
        <p className="text-text-muted mb-6">Masukkan kode tiket untuk memproses check-in</p>
        <div className="flex gap-3 max-w-md mx-auto">
          <Input
            placeholder="TKT-XXXXXXXX"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            icon={QrCode}
            className="text-center font-mono"
          />
          <Button onClick={() => handleCheck()} disabled={checking || !query.trim()}>
            {checking ? 'Mengecek...' : 'Validasi'}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`rounded-[24px] p-8 border mb-6 ${
              result.valid
                ? 'bg-success/10 border-success/30'
                : 'bg-error/10 border-error/30'
            }`}
          >
            <div className="text-center mb-6">
              {result.valid ? (
                <CheckCircle2 size={64} className="text-success mx-auto mb-4" />
              ) : (
                <XCircle size={64} className="text-error mx-auto mb-4" />
              )}
              <h2 className={`text-2xl font-black mb-2 ${
                result.valid ? 'text-success' : 'text-error'
              }`}>
                {result.valid ? 'Check-in Berhasil!' : 'Tiket Ditolak'}
              </h2>
              <p className="text-text-muted">
                {result.valid
                  ? 'User diperbolehkan masuk ke area festival.'
                  : result.reason}
              </p>
            </div>

            {result.ticket && (
              <div className="bg-secondary-bg border border-border rounded-[18px] p-5 space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-text-muted font-mono text-xs">{result.ticket.code}</span>
                  <span className="text-primary-accent font-medium">{result.ticket.ticketTypeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Festival</span>
                  <span className="text-text-primary">{result.ticket.festivalTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted flex items-center gap-2">
                    <MapPin size={14} /> Lokasi
                  </span>
                  <span className="text-text-primary">{result.ticket.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted flex items-center gap-2">
                    <Calendar size={14} /> Tanggal
                  </span>
                  <span className="text-text-primary">{formatDate(result.ticket.festivalDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Pemesan</span>
                  <span className="text-text-primary">ID: {result.ticket.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Waktu Proses</span>
                  <span className="text-text-primary">
                    {new Date().toLocaleTimeString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={handleReset}>
              <RefreshCw size={16} />
              Validasi Lainnya
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-secondary-bg border border-border rounded-[24px] p-6">
        <p className="text-sm font-semibold text-text-muted mb-4">Kode uji coba:</p>
        <div className="flex flex-wrap gap-2">
          {testCodes.map((tc) => (
            <button
              key={tc.code}
              onClick={() => handleCheck(tc.code)}
              disabled={checking}
              className="px-4 py-2 rounded-full bg-surface border border-border text-xs text-text-secondary hover:border-primary-accent/40 hover:text-text-primary transition-all cursor-pointer disabled:opacity-50"
            >
              {tc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CheckInPage() {
  return <CheckInContent />;
}