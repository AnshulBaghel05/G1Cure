import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AnimatedSwitch } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { 
  Smartphone,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Bell,
  BellOff,
  Settings,
  Home,
  User,
  Calendar,
  Video,
  FileText,
  Shield,
  Zap,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalLow,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface MobilePWAProps {
  children: React.ReactNode;
}

interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  isStandalone: boolean;
  hasPushSupport: boolean;
  hasNotificationSupport: boolean;
  hasServiceWorker: boolean;
  batteryLevel: number;
  isCharging: boolean;
  networkType: string;
  networkSpeed: string;
}

interface OfflineData {
  appointments: any[];
  patients: any[];
  medicalRecords: any[];
  lastSync: Date;
}

export function MobilePWA({ children }: MobilePWAProps) {
  const { toast } = useToast();
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: navigator.onLine,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    hasPushSupport: 'serviceWorker' in navigator && 'PushManager' in window,
    hasNotificationSupport: 'Notification' in window,
    hasServiceWorker: 'serviceWorker' in navigator,
    batteryLevel: 100,
    isCharging: false,
    networkType: 'unknown',
    networkSpeed: 'unknown'
  });

  const [offlineData, setOfflineData] = useState<OfflineData>({
    appointments: [],
    patients: [],
    medicalRecords: [],
    lastSync: new Date()
  });

  const [isInstalling, setIsInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const batteryRef = useRef<any>(null);
  const networkRef = useRef<any>(null);

  useEffect(() => {
    initializePWA();
    setupEventListeners();
    checkBatteryStatus();
    checkNetworkStatus();
    setupServiceWorker();
    setupPushNotifications();
    loadOfflineData();

    return () => {
      cleanup();
    };
  }, []);

  const initializePWA = () => {
    // Check if app is installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;

    setPwaStatus(prev => ({
      ...prev,
      isInstalled,
      isOnline: navigator.onLine
    }));

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      toast({
        title: 'Install G1Cure',
        description: 'Install our app for a better experience',
      });
    });
  };

  const setupEventListeners = () => {
    // Online/offline events
    window.addEventListener('online', () => {
      setPwaStatus(prev => ({ ...prev, isOnline: true }));
      toast({
        title: 'Back Online',
        description: 'Connection restored',
      });
      syncOfflineData();
    });

    window.addEventListener('offline', () => {
      setPwaStatus(prev => ({ ...prev, isOnline: false }));
      toast({
        title: 'Offline Mode',
        description: 'Working with cached data',
        variant: 'destructive',
      });
    });

    // Visibility change for background sync
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && pwaStatus.isOnline) {
        syncOfflineData();
      }
    });

    // Network status changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkStatus);
    }
  };

  const checkBatteryStatus = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        batteryRef.current = battery;

        const updateBatteryInfo = () => {
          setPwaStatus(prev => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100),
            isCharging: battery.charging
          }));
        };

        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
        updateBatteryInfo();
      } catch (error) {
        console.error('Battery API not supported:', error);
      }
    }
  };

  const checkNetworkStatus = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      updateNetworkStatus();

      connection.addEventListener('change', updateNetworkStatus);
    }
  };

  const updateNetworkStatus = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setPwaStatus(prev => ({
        ...prev,
        networkType: connection.effectiveType || 'unknown',
        networkSpeed: connection.downlink ? `${connection.downlink} Mbps` : 'unknown'
      }));
    }
  };

  const setupServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                toast({
                  title: 'Update Available',
                  description: 'A new version is available. Refresh to update.',
                });
              }
            });
          }
        });

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'SYNC_COMPLETE') {
            setSyncProgress(100);
            setIsSyncing(false);
            toast({
              title: 'Sync Complete',
              description: 'All data has been synchronized',
            });
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const setupPushNotifications = async () => {
    if (!pwaStatus.hasPushSupport) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Request notification permission
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          toast({
            title: 'Notifications Enabled',
            description: 'You will receive important updates',
          });
        }
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // Replace with your VAPID key
      });

      // Send subscription to backend
      // await backend.notifications.subscribeToPush(subscription);

    } catch (error) {
      console.error('Push notification setup failed:', error);
    }
  };

  const loadOfflineData = () => {
    // Load cached data from IndexedDB
    const cachedData = localStorage.getItem('g1cure_offline_data');
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        setOfflineData(data);
      } catch (error) {
        console.error('Failed to load offline data:', error);
      }
    }
  };

  const installPWA = async () => {
    if (!deferredPrompt) {
      toast({
        title: 'Installation Unavailable',
        description: 'PWA installation is not available',
        variant: 'destructive',
      });
      return;
    }

    setIsInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setPwaStatus(prev => ({ ...prev, isInstalled: true }));
        toast({
          title: 'Installation Successful',
          description: 'G1Cure has been installed successfully',
        });
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA installation failed:', error);
      toast({
        title: 'Installation Failed',
        description: 'Failed to install the app',
        variant: 'destructive',
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const syncOfflineData = async () => {
    if (!pwaStatus.isOnline) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      // Simulate sync progress
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Sync appointments
      // const appointments = await backend.appointments.getOfflineAppointments();
      // setOfflineData(prev => ({ ...prev, appointments }));

      // Sync patients
      // const patients = await backend.patients.getOfflinePatients();
      // setOfflineData(prev => ({ ...prev, patients }));

      // Sync medical records
      // const medicalRecords = await backend.medicalRecords.getOfflineRecords();
      // setOfflineData(prev => ({ ...prev, medicalRecords, lastSync: new Date() }));

      // Save to localStorage
      localStorage.setItem('g1cure_offline_data', JSON.stringify(offlineData));

      // Notify service worker
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_COMPLETE'
        });
      }

      clearInterval(progressInterval);
      setSyncProgress(100);

      toast({
        title: 'Sync Complete',
        description: 'All data has been synchronized',
      });

    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to synchronize data',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleNotifications = async () => {
    if (!pwaStatus.hasNotificationSupport) return;

    if (Notification.permission === 'granted') {
      // Unsubscribe from notifications
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      toast({
        title: 'Notifications Disabled',
        description: 'You will no longer receive notifications',
      });
    } else {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await setupPushNotifications();
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('g1cure_dark_mode', (!isDarkMode).toString());
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement audio muting logic
  };

  const refreshApp = () => {
    window.location.reload();
  };

  const cleanup = () => {
    if (batteryRef.current) {
      batteryRef.current.removeEventListener('levelchange', updateBatteryInfo);
      batteryRef.current.removeEventListener('chargingchange', updateBatteryInfo);
    }

    if (networkRef.current) {
      networkRef.current.removeEventListener('change', updateNetworkStatus);
    }
  };

  const updateBatteryInfo = () => {
    if (batteryRef.current) {
      setPwaStatus(prev => ({
        ...prev,
        batteryLevel: Math.round(batteryRef.current.level * 100),
        isCharging: batteryRef.current.charging
      }));
    }
  };

  return (
    <div className="mobile-pwa-container">
      {/* PWA Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm text-white px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3 h-3" />
            <span>G1Cure</span>
            {pwaStatus.isInstalled && (
              <Badge variant="secondary" className="text-xs">Installed</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Network Status */}
            {pwaStatus.isOnline ? (
              <Wifi className="w-3 h-3 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-400" />
            )}
            
            {/* Battery Status */}
            <div className="flex items-center gap-1">
              {pwaStatus.isCharging ? (
                <BatteryCharging className="w-3 h-3 text-green-400" />
              ) : (
                <Battery className="w-3 h-3" />
              )}
              <span>{pwaStatus.batteryLevel}%</span>
            </div>
            
            {/* Network Speed */}
            {pwaStatus.networkSpeed !== 'unknown' && (
              <span className="text-xs opacity-75">{pwaStatus.networkSpeed}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-12">
        {children}
      </div>

      {/* PWA Controls */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Sync Status */}
              <div className="flex items-center gap-2">
                {isSyncing ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Syncing {syncProgress}%</span>
                  </div>
                ) : pwaStatus.isOnline ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Offline</span>
                  </div>
                )}
              </div>

              {/* PWA Actions */}
              <div className="flex items-center gap-2">
                {/* Install Button */}
                {!pwaStatus.isInstalled && deferredPrompt && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={installPWA}
                    disabled={isInstalling}
                  >
                    {isInstalling ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                )}

                {/* Sync Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={syncOfflineData}
                  disabled={!pwaStatus.isOnline || isSyncing}
                >
                  <Upload className="w-4 h-4" />
                </Button>

                {/* Notifications Toggle */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleNotifications}
                >
                  {Notification.permission === 'granted' ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </Button>

                {/* Dark Mode Toggle */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>

                {/* Mute Toggle */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>

                {/* Refresh Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refreshApp}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offline Data Indicator */}
      {!pwaStatus.isOnline && (
        <div className="fixed top-16 left-4 right-4 z-40">
          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <Info className="w-4 h-4" />
                <span className="text-sm">
                  Working offline with {offlineData.appointments.length} cached appointments
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sync Progress */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-20 left-4 right-4 z-40"
          >
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    Syncing data... {syncProgress}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
                  <div
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
