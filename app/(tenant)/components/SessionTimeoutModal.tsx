"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getAccessToken, secondsUntilExpiry, performTokenRefresh } from '@/lib/auth';

export default function SessionTimeoutModal() {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [hardExpired, setHardExpired] = useState(false);

  useEffect(() => {
    // Show warning 2 minutes before access token expiry
    let tick: any;
    function update() {
      const secs = secondsUntilExpiry(getAccessToken());
      setSecondsLeft(secs);
      if (secs !== null) {
        setOpen(secs <= 120 && secs > 0);
      }
    }
    update();
    tick = setInterval(update, 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setHardExpired(true);
      setOpen(true);
    };
    const onRefreshFailed = () => {
      // Network hiccup: show warning but not hard expired
      setOpen(true);
    };
    window.addEventListener('session:expired' as any, onExpired);
    window.addEventListener('session:refresh-failed' as any, onRefreshFailed);
    return () => {
      window.removeEventListener('session:expired' as any, onExpired);
      window.removeEventListener('session:refresh-failed' as any, onRefreshFailed);
    };
  }, []);

  const handleStaySignedIn = async () => {
    const ok = await performTokenRefresh();
    if (ok) setOpen(false);
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Session expiring soon</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          {!hardExpired ? (
            <p>Your session will expire {secondsLeft !== null ? `in ${secondsLeft}s` : 'soon'}. To continue working, stay signed in.</p>
          ) : (
            <p>Your session has expired. Please sign in again.</p>
          )}
        </div>
        <DialogFooter>
          {!hardExpired ? (
            <>
              <Button variant="outline" onClick={handleSignIn}>Sign in again</Button>
              <Button onClick={handleStaySignedIn}>Stay signed in</Button>
            </>
          ) : (
            <Button onClick={handleSignIn}>Go to login</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
