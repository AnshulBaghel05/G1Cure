// Simple UI Components (replacing animated versions)
export { default as SimpleButton } from './SimpleButton';
export { default as SimpleCard } from './SimpleCard';
export { default as SimpleInput } from './SimpleInput';
export { default as SimpleModal } from './SimpleModal';
export { default as SimpleTable } from './SimpleTable';
export { default as SimpleSkeleton } from './SimpleSkeleton';
export { default as SimpleDropdown } from './SimpleDropdown';
export { default as SimpleTooltip } from './SimpleTooltip';
export { default as SimpleProgress } from './SimpleProgress';
export { default as SimpleAccordion } from './SimpleAccordion';
export { default as SimpleTabs } from './SimpleTabs';
export { default as SimpleBadge } from './SimpleBadge';
export { default as SimpleSearch } from './SimpleSearch';
export { default as SimpleSwitch } from './SimpleSwitch';
export { default as SimpleRating } from './SimpleRating';
export { default as SimpleTimeline } from './SimpleTimeline';
export { default as SimpleStepper } from './SimpleStepper';
export { default as SimpleCounter } from './SimpleCounter';
export { default as SimpleBreadcrumb } from './SimpleBreadcrumb';
export { default as SimpleCalendar } from './SimpleCalendar';
export { default as SimpleChart } from './SimpleChart';
export { default as SimpleCarousel } from './SimpleCarousel';
export { default as SimpleNotification, SimpleNotificationContainer } from './SimpleNotification';

// Animated UI Components (kept for critical UX only)
export { default as AnimatedButton } from './AnimatedButton';
export { default as AnimatedCard } from './AnimatedCard';
export { default as AnimatedIcon } from './AnimatedIcon';
export { default as AnimatedProgress } from './AnimatedProgress';
export { default as AnimatedToast } from './AnimatedToast';
export { default as AnimatedTable } from './AnimatedTable';
export { default as AnimatedInput } from './AnimatedInput';
export { default as AnimatedModal } from './AnimatedModal';
export { default as AnimatedDropdown } from './AnimatedDropdown';
export { default as AnimatedTooltip } from './AnimatedTooltip';
export { default as AnimatedBadge } from './AnimatedBadge';
export { default as AnimatedAccordion } from './AnimatedAccordion';
export { default as AnimatedTabs } from './AnimatedTabs';
export { default as AnimatedStepper } from './AnimatedStepper';
export { default as AnimatedCarousel } from './AnimatedCarousel';
export { default as AnimatedNotifications, useNotifications } from './AnimatedNotifications';
export { default as AnimatedSearch } from './AnimatedSearch';
export { default as AnimatedCalendar } from './AnimatedCalendar';
export { default as AnimatedSkeleton } from './AnimatedSkeleton';
export { default as AnimatedChart } from './AnimatedChart';
export { AnimatedSwitch } from './AnimatedSwitch';

// Enhanced UI Components
export { PageTransition } from './PageTransition';
export { 
  EnhancedSkeleton, 
  CardSkeleton, 
  TableSkeleton, 
  ChartSkeleton 
} from './EnhancedSkeleton';
export { InteractiveSearch } from './InteractiveSearch';
export { 
  DragAndDrop, 
  AppointmentScheduler, 
  FileUploader, 
  SortableList 
} from './DragAndDrop';

// Phase 3: Technical Implementation Components
export { EnhancedForm } from './EnhancedForm';

// Phase 4: Feature Implementation Components
export { RealTimeNotifications } from './RealTimeNotifications';

// Phase 5: Visual Design & Branding Components
export { 
  DesignSystemShowcase, 
  ColorPalette, 
  TypographyScale 
} from './DesignSystem';
export { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows, 
  transitions 
} from './DesignSystem';

// Re-export existing components
export { Button } from './button';
export { Input } from './input';
export { Label } from './label';
export { Textarea } from './textarea';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { Checkbox } from './checkbox';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
export { Badge } from './badge';
export { LoadingSpinner } from './LoadingSpinner';
export { default as FloatingActionButton } from './FloatingActionButton';
export { useToast } from './use-toast';
export { Toaster } from './toaster';
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast';
export { cn } from '@/lib/utils';
