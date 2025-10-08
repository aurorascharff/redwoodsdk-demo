'use client';

import { useEffect, useState } from 'react';

export function StressTest() {
  const [requestCount, setRequestCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fireRequest = async () => {
      try {
        const response = await fetch('/api/stress-test');
        if (!response.ok) {
          setErrorCount(prev => prev + 1);
        }
        setRequestCount(prev => prev + 1);
      } catch (error) {
        setErrorCount(prev => prev + 1);
      }
    };

    const runStressTest = () => {
      const interval = setInterval(() => {
        if (!active) {
          clearInterval(interval);
          return;
        }

        // Fire 5 requests without waiting for them to complete
        for (let i = 0; i < 5; i++) {
          fireRequest();
        }
      }, 100);

      return interval;
    };

    const interval = runStressTest();

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed right-4 bottom-4 rounded-lg bg-orange-100 px-4 py-2 text-xs shadow-lg dark:bg-orange-900">
      <div className="font-semibold">🔥 Stress Test Active</div>
      <div className="mt-1 text-orange-800 dark:text-orange-200">
        Requests: {requestCount} | Errors: {errorCount}
      </div>
    </div>
  );
}
