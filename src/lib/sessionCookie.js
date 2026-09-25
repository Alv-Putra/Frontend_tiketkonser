const SESSION_COOKIE_NAME = 'conser_session';

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export function setSessionCookie(role) {
  const value = encodeURIComponent(JSON.stringify({ role }));
  document.cookie = `${SESSION_COOKIE_NAME}=${value}; path=/; max-age=${SESSION_TTL_SECONDS}; SameSite=Lax`;
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}