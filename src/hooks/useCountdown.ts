import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownProps {
  seconds: number;
  enabled: boolean;
  onExpire: () => void;
}

export function useCountdown({ seconds, enabled, onExpire }: UseCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const reset = useCallback(() => setTimeLeft(seconds), [seconds]);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [enabled]);

  const minutes = Math.floor(timeLeft / 60);
  const secs    = timeLeft % 60;
  const display = `${minutes}:${String(secs).padStart(2, '0')}`;

  return { timeLeft, display, reset };
}
