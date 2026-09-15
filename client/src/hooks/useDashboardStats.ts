import { useCallback, useEffect, useState } from 'react';
import type { DashboardStats } from '../types';
import * as dashboardService from '../services/dashboardService';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch {
      setError("Couldn't load dashboard stats.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, isLoading, error, refresh };
}
