'use client';

import { Component } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log error to monitoring service in production
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-5 bg-primary-bg">
          <div className="text-center max-w-lg">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-error" />
            </div>

            {/* Content */}
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Oops! Terjadi Kesalahan
            </h1>
            <p className="text-text-secondary mb-6">
              Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang bekerja untuk memperbaikinya.
            </p>

            {/* Technical Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 p-4 bg-surface border border-border rounded-[18px]">
                <summary className="font-medium text-text-primary cursor-pointer">
                  Detail Error (Development Only)
                </summary>
                <pre className="mt-3 text-xs text-error overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Home size={18} />
                Kembali ke Beranda
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <RefreshCw size={18} />
                Muat Ulang Halaman
              </button>
            </div>

            {/* Support Link */}
            <p className="mt-8 text-sm text-text-muted">
              Jika masalah terus berlanjut, hubungi{' '}
              <a
                href="mailto:support@conserid.com"
                className="text-primary-accent hover:underline"
              >
                support@conserid.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
