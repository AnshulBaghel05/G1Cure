// Animated UI Components
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
