import { useEffect, useState, useCallback } from "react";

interface PerformanceMetrics {
  isMobile: boolean;
  isSlowConnection: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemory?: number;
  connectionType?: string;
}

export function useMobilePerformance(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isMobile: false,
    isSlowConnection: false,
    reducedMotion: false,
    saveData: false,
  });

  useEffect(() => {
    const updateMetrics = () => {
      const nav = navigator as any;
      
      // Check if mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;

      // Check connection speed
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      const isSlowConnection = connection
        ? connection.effectiveType === "slow-2g" || 
          connection.effectiveType === "2g" ||
          connection.effectiveType === "3g"
        : false;

      // Check for reduced motion preference
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Check for data saver mode
      const saveData = connection?.saveData || false;

      // Get device memory (if available)
      const deviceMemory = nav.deviceMemory;

      setMetrics({
        isMobile,
        isSlowConnection,
        reducedMotion,
        saveData,
        deviceMemory,
        connectionType: connection?.effectiveType,
      });
    };

    updateMetrics();

    // Listen for connection changes
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (connection) {
      connection.addEventListener("change", updateMetrics);
    }

    // Listen for resize events
    window.addEventListener("resize", updateMetrics);

    return () => {
      if (connection) {
        connection.removeEventListener("change", updateMetrics);
      }
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  return metrics;
}

export function useAdaptiveLoading() {
  const { isSlowConnection, saveData, deviceMemory } = useMobilePerformance();
  
  const shouldReduceQuality = isSlowConnection || saveData || (deviceMemory && deviceMemory <= 2);
  const shouldLazyLoad = isSlowConnection || saveData;
  const shouldPreload = !isSlowConnection && !saveData && (!deviceMemory || deviceMemory > 4);
  
  return {
    imageQuality: shouldReduceQuality ? 40 : 75,
    videoAutoplay: !shouldReduceQuality,
    enableAnimations: !shouldReduceQuality,
    lazyLoadOffset: shouldLazyLoad ? "50px" : "200px",
    shouldPreload,
    maxConcurrentRequests: shouldReduceQuality ? 2 : 6,
  };
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isOnline) {
        setWasOffline(true);
        setTimeout(() => setWasOffline(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  return { isOnline, wasOffline };
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}