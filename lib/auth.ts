// Centralized auth utilities
export function saveTokens(access: string, refresh: string) {
  try {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    window.dispatchEvent(new CustomEvent('auth:tokeset'));
  } catch {}
}

export function getAccessToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem('refresh_token');
}

export function clearTokens() {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new CustomEvent('auth:tokeclear'));
  } catch {}
}

export function setTenant(tenant: string) {
  try {
    return localStorage.setItem('tenant', tenant);
  } catch {}
}
export function getTenant() {
  return typeof window === 'undefined' ? null : localStorage.getItem('tenant');
}

// Decode JWT exp helper
export function decodeJwt(token?: string | null): any | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

export function getTokenExpiry(token?: string | null): number | null {
  const decoded = decodeJwt(token || undefined);
  return decoded?.exp ? decoded.exp * 1000 : null; // ms
}

export function getApiBaseUrl(): string | null {
  const tenant = getTenant();
  if (!tenant) return null;
  return `https://${tenant}.exxforce.com`;
}

export async function performTokenRefresh(): Promise<string | null> {
  const refresh = getRefreshToken();
  const base = getApiBaseUrl();
  if (!refresh || !base) return null;
  try {
    const res = await fetch(`${base}/api/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      // If refresh is invalid, clear tokens and broadcast expiry
      clearTokens();
      window.dispatchEvent(new CustomEvent('session:expired', { detail: { status: res.status } }));
      return null;
    }
    const data = await res.json();
    const access = data.access || data.access_token;
    const newRefresh = data.refresh || data.refresh_token;
    if (access) localStorage.setItem('access_token', access);
    if (newRefresh) localStorage.setItem('refresh_token', newRefresh);
    window.dispatchEvent(new CustomEvent('auth:tokeset'));
    return access || null;
  } catch (e) {
    // Network failure; do not clear tokens yet, but broadcast problem
    console.error('performTokenRefresh error:', e);
    window.dispatchEvent(new CustomEvent('session:refresh-failed'));
    return null;
  }
}

export function secondsUntilExpiry(token?: string | null): number | null {
  const exp = getTokenExpiry(token || undefined);
  if (!exp) return null;
  return Math.max(0, Math.floor((exp - Date.now()) / 1000));
}