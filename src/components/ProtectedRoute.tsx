'use client';

export default function ProtectedRoute({ children, roles = [] }) {
  return <>{children}</>;
}
