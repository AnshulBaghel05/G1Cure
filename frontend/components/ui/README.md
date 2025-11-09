# Animated UI Components

A comprehensive collection of beautiful, interactive React components with smooth animations built using Framer Motion and Tailwind CSS.

## 🚀 Features

- **Smooth Animations**: All components feature carefully crafted animations using Framer Motion
- **Dark Mode Support**: Full dark mode compatibility with Tailwind CSS
- **TypeScript**: Built with TypeScript for type safety
- **Accessible**: Follows accessibility best practices
- **Customizable**: Extensive customization options for colors, sizes, and animations
- **Responsive**: Mobile-first responsive design

## 📦 Installation

The components are already included in the project. Make sure you have the required dependencies:

```bash
npm install framer-motion lucide-react
```

## 🎯 Quick Start

```tsx
import { AnimatedButton, AnimatedCard, AnimatedIcon } from '@/components/ui';

function MyComponent() {
  return (
    <AnimatedCard className="p-6">
      <AnimatedIcon size="lg" animation="pulse">
        <Heart className="w-8 h-8" />
      </AnimatedIcon>
      <AnimatedButton variant="default" size="lg">
        Click Me!
      </AnimatedButton>
    </AnimatedCard>
  );
}
```

## 🧩 Components

### Basic Components

#### AnimatedButton
Enhanced button component with hover, tap, and loading animations.

```tsx
<AnimatedButton 
  variant="default" 
  size="lg" 
  loading={false}
  onClick={() => console.log('Clicked!')}
>
  Click Me
</AnimatedButton>
```

**Props:**
- `variant`: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean
- `className`: string

#### AnimatedCard
Card component with entrance animations and hover effects.

```tsx
<AnimatedCard 
  className="p-6" 
  hoverEffect="lift"
  entranceAnimation="fadeIn"
>
  Card content
</AnimatedCard>
```

**Props:**
- `hoverEffect`: 'lift' | 'glow' | 'scale' | 'none'
- `entranceAnimation`: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomIn'
- `className`: string

#### AnimatedIcon
Icon wrapper with various animation effects.

```tsx
<AnimatedIcon 
  size="lg" 
  animation="pulse" 
  color="blue"
>
  <Heart className="w-8 h-8" />
</AnimatedIcon>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `animation`: 'pulse' | 'bounce' | 'spin' | 'shake' | 'none'
- `color`: string
- `className`: string

#### AnimatedProgress
Progress indicators with different visual variants.

```tsx
<AnimatedProgress 
  value={75} 
  variant="gradient" 
  size="lg"
  showLabel={true}
  animated={true}
/>
```

**Props:**
- `value`: number
- `max`: number (default: 100)
- `variant`: 'default' | 'gradient' | 'striped' | 'circular'
- `size`: 'sm' | 'md' | 'lg'
- `showLabel`: boolean
- `animated`: boolean

### Form Components

#### AnimatedInput
Enhanced input field with floating labels and validation states.

```tsx
<AnimatedInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  type="email"
  icon={<Mail className="w-4 h-4" />}
  error="Please enter a valid email"
  success="Email is valid!"
/>
```

**Props:**
- `label`: string
- `placeholder`: string
- `value`: string
- `onChange`: (value: string) => void
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel'
- `error`: string
- `success`: string
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'

#### AnimatedSearch
Search input with suggestions and filters.

```tsx
<AnimatedSearch
  placeholder="Search..."
  onSearch={(query) => console.log(query)}
  suggestions={searchSuggestions}
  showSuggestions={true}
  showFilters={true}
  debounceMs={300}
/>
```

**Props:**
- `placeholder`: string
- `onSearch`: (query: string) => void
- `suggestions`: SearchSuggestion[]
- `showSuggestions`: boolean
- `showFilters`: boolean
- `debounceMs`: number

#### AnimatedDropdown
Dropdown menu with options and icons.

```tsx
<AnimatedDropdown
  options={dropdownOptions}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select an option"
  variant="outlined"
  size="md"
/>
```

**Props:**
- `options`: DropdownOption[]
- `value`: string
- `onChange`: (value: string) => void
- `placeholder`: string
- `variant`: 'default' | 'outlined' | 'filled'
- `size`: 'sm' | 'md' | 'lg'

### Data Display

#### AnimatedTable
Data table with loading states and row animations.

```tsx
<AnimatedTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ]}
  data={tableData}
  onRowClick={(row) => console.log(row)}
  loading={false}
  emptyMessage="No data available"
/>
```

**Props:**
- `columns`: Column[]
- `data`: any[]
- `onRowClick`: (row: any) => void
- `loading`: boolean
- `emptyMessage`: string

#### AnimatedChart
Charts with smooth animations and interactions.

```tsx
<AnimatedChart
  data={chartData}
  type="bar"
  title="Monthly Sales"
  width={400}
  height={300}
  onDataPointClick={(data, index) => console.log(data, index)}
/>
```

**Props:**
- `data`: ChartData[]
- `type`: 'bar' | 'line' | 'pie'
- `title`: string
- `width`: number
- `height`: number
- `onDataPointClick`: (data: ChartData, index: number) => void

#### AnimatedCalendar
Interactive calendar with event display.

```tsx
<AnimatedCalendar
  events={calendarEvents}
  onDateSelect={(date) => console.log(date)}
  onEventClick={(event) => console.log(event)}
  showEvents={true}
  showNavigation={true}
  showToday={true}
/>
```

**Props:**
- `events`: CalendarEvent[]
- `onDateSelect`: (date: Date) => void
- `onEventClick`: (event: CalendarEvent) => void
- `showEvents`: boolean
- `showNavigation`: boolean
- `showToday`: boolean

### Interactive Components

#### AnimatedTabs
Tab navigation with smooth content transitions.

```tsx
<AnimatedTabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
  ]}
  defaultTab="tab1"
  variant="pills"
  onChange={(tabId) => console.log(tabId)}
/>
```

**Props:**
- `tabs`: TabItem[]
- `defaultTab`: string
- `variant`: 'default' | 'pills' | 'underline' | 'cards'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `onChange`: (tabId: string) => void

#### AnimatedAccordion
Collapsible content sections.

```tsx
<AnimatedAccordion
  items={[
    { id: 'item1', title: 'Section 1', content: 'Content 1' },
    { id: 'item2', title: 'Section 2', content: 'Content 2' }
  ]}
  variant="bordered"
  allowMultiple={true}
  defaultOpen={['item1']}
/>
```

**Props:**
- `items`: AccordionItem[]
- `variant`: 'default' | 'bordered' | 'elevated'
- `allowMultiple`: boolean
- `defaultOpen`: string[]

#### AnimatedStepper
Step-by-step navigation with progress tracking.

```tsx
<AnimatedStepper
  steps={[
    { id: 'step1', title: 'Step 1', content: <div>Step 1 content</div> },
    { id: 'step2', title: 'Step 2', content: <div>Step 2 content</div> }
  ]}
  currentStep={0}
  variant="cards"
  showProgress={true}
  onStepChange={(stepIndex) => setCurrentStep(stepIndex)}
/>
```

**Props:**
- `steps`: Step[]
- `currentStep`: number
- `variant`: 'default' | 'vertical' | 'cards'
- `showProgress`: boolean
- `onStepChange`: (stepIndex: number) => void

#### AnimatedCarousel
Image/content carousel with navigation.

```tsx
<AnimatedCarousel
  items={carouselItems}
  autoPlay={true}
  autoPlayInterval={5000}
  showArrows={true}
  showDots={true}
  height={400}
  loop={true}
/>
```

**Props:**
- `items`: CarouselItem[]
- `autoPlay`: boolean
- `autoPlayInterval`: number
- `showArrows`: boolean
- `showDots`: boolean
- `height`: string | number
- `loop`: boolean

### Feedback Components

#### AnimatedToast
Temporary notification messages.

```tsx
<AnimatedToast
  message="Operation completed successfully!"
  type="success"
  duration={5000}
  onClose={() => setShowToast(false)}
/>
```

**Props:**
- `message`: string
- `type`: 'success' | 'error' | 'warning' | 'info'
- `duration`: number
- `onClose`: () => void

#### AnimatedModal
Modal dialogs with backdrop and animations.

```tsx
<AnimatedModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  size="md"
  closeOnBackdrop={true}
  showCloseButton={true}
>
  Modal content goes here
</AnimatedModal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `closeOnBackdrop`: boolean
- `showCloseButton`: boolean

#### AnimatedNotifications
Comprehensive notification system with hook.

```tsx
const { notifications, showSuccess, showError, showWarning, showInfo } = useNotifications();

// Show notifications
showSuccess('Success!', 'Operation completed');
showError('Error!', 'Something went wrong');

// Render notifications
<AnimatedNotifications
  notifications={notifications}
  onRemove={removeNotification}
  position="top-right"
/>
```

**Props:**
- `notifications`: Notification[]
- `onRemove`: (id: string) => void
- `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
- `maxNotifications`: number

### Loading States

#### AnimatedSkeleton
Loading placeholders with shimmer effects.

```tsx
<AnimatedSkeleton 
  variant="card" 
  animated={true} 
  speed="normal"
/>
```

**Props:**
- `variant`: 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'list' | 'form' | 'avatar'
- `width`: string | number
- `height`: string | number
- `lines`: number
- `rows`: number
- `columns`: number
- `animated`: boolean
- `speed`: 'slow' | 'normal' | 'fast'
- `color`: 'light' | 'dark' | 'custom'

### Utility Components

#### AnimatedTooltip
Contextual information on hover.

```tsx
<AnimatedTooltip 
  content="This is a tooltip" 
  position="top"
  delay={0.5}
>
  <button>Hover me</button>
</AnimatedTooltip>
```

**Props:**
- `content`: string | ReactNode
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `delay`: number
- `maxWidth`: number
- `showArrow`: boolean

#### AnimatedBadge
Status indicators and labels.

```tsx
<AnimatedBadge 
  variant="success" 
  size="md" 
  pulse={true}
  removable={true}
  onRemove={() => console.log('Removed')}
>
  Active
</AnimatedBadge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `pulse`: boolean
- `glow`: boolean
- `removable`: boolean
- `onRemove`: () => void

## 🎨 Customization

### Colors
Most components support custom colors through Tailwind CSS classes or direct color props.

### Animations
Components use Framer Motion for animations. You can customize:
- Duration
- Easing
- Delay
- Animation variants

### Dark Mode
All components automatically support dark mode through Tailwind CSS classes.

## 📱 Responsive Design

Components are built with mobile-first responsive design:
- Responsive grid layouts
- Touch-friendly interactions
- Adaptive sizing
- Mobile-optimized animations

## ♿ Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support

## 🔧 Development

### Adding New Components
1. Create the component file in `frontend/components/ui/`
2. Export from `frontend/components/ui/index.ts`
3. Add to the demo page
4. Update this README

### Testing
Components are showcased in the demo page at `/demo`

### Dependencies
- React 18+
- Framer Motion
- Tailwind CSS
- Lucide React
- TypeScript

## 📚 Examples

See the demo page at `/demo` for comprehensive examples of all components in action.

## 🤝 Contributing

When adding new components:
1. Follow the existing component patterns
2. Include TypeScript interfaces
3. Add proper JSDoc comments
4. Ensure accessibility compliance
5. Test with different screen sizes
6. Update the demo page and README

## 📄 License

This project is part of G1Cure and follows the same licensing terms.
