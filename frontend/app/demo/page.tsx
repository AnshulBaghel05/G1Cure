'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AnimatedButton,
  AnimatedCard,
  AnimatedIcon,
  AnimatedProgress,
  AnimatedToast,
  AnimatedTable,
  AnimatedInput,
  AnimatedModal,
  AnimatedDropdown,
  AnimatedTooltip,
  AnimatedBadge,
  AnimatedAccordion,
  AnimatedTabs,
  AnimatedStepper,
  AnimatedCarousel,
  AnimatedNotifications,
  useNotifications,
  AnimatedSearch,
  AnimatedCalendar,
  AnimatedSkeleton,
  AnimatedChart,
} from '@/components/ui';
import { 
  Heart, 
  Star, 
  Zap, 
  Settings, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Search,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  ChevronDown,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Circle,
  Clock,
  TrendingUp,
  MapPin,
  Filter,
  X
} from 'lucide-react';

export default function DemoPage() {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAccordionOpen, setIsAccordionOpen] = useState<string[]>(['item-1']);
  
  const { notifications, showSuccess, showError, showWarning, showInfo, removeNotification } = useNotifications();

  // Sample data for charts
  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 59 },
    { label: 'Mar', value: 80 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 56 },
    { label: 'Jun', value: 55 },
  ];

  // Sample data for table
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  ];

  // Sample data for carousel
  const carouselItems = [
    { id: '1', content: <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">Slide 1</div> },
    { id: '2', content: <div className="h-64 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">Slide 2</div> },
    { id: '3', content: <div className="h-64 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">Slide 3</div> },
  ];

  // Sample data for calendar events
  const calendarEvents = [
    { id: '1', title: 'Team Meeting', date: new Date(), type: 'meeting' as const },
    { id: '2', title: 'Doctor Appointment', date: new Date(Date.now() + 86400000), type: 'appointment' as const },
  ];

  // Sample data for stepper
  const stepperSteps = [
    { id: 'step-1', title: 'Personal Info', content: <div className="p-4">Enter your personal information</div> },
    { id: 'step-2', title: 'Contact Details', content: <div className="p-4">Provide your contact information</div> },
    { id: 'step-3', title: 'Review', content: <div className="p-4">Review and submit your information</div> },
  ];

  // Sample data for accordion
  const accordionItems = [
    { id: 'item-1', title: 'What is G1Cure?', content: 'G1Cure is a comprehensive healthcare platform...' },
    { id: 'item-2', title: 'How does it work?', content: 'Our platform uses advanced technology...' },
    { id: 'item-3', title: 'Is it secure?', content: 'Yes, we use enterprise-grade security...' },
  ];

  // Sample data for tabs
  const tabItems = [
    { id: 'overview', label: 'Overview', content: <div className="p-4">Overview content goes here</div> },
    { id: 'analytics', label: 'Analytics', content: <div className="p-4">Analytics content goes here</div> },
    { id: 'reports', label: 'Reports', content: <div className="p-4">Reports content goes here</div> },
  ];

  // Sample data for dropdown
  const dropdownOptions = [
    { value: 'option1', label: 'Option 1', icon: <User className="w-4 h-4" /> },
    { value: 'option2', label: 'Option 2', icon: <Mail className="w-4 h-4" /> },
    { value: 'option3', label: 'Option 3', icon: <Phone className="w-4 h-4" /> },
  ];

  // Sample search suggestions
  const searchSuggestions = [
    { id: '1', text: 'Healthcare', type: 'trending' as const, icon: <TrendingUp className="w-4 h-4" /> },
    { id: '2', text: 'Medical Records', type: 'recent' as const, icon: <Clock className="w-4 h-4" /> },
    { id: '3', text: 'Patient Portal', type: 'suggestion' as const, icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Animated UI Components
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Beautiful, interactive components with smooth animations
          </motion.p>
        </div>

        {/* Notifications */}
        <AnimatedNotifications
          notifications={notifications}
          onRemove={removeNotification}
          position="top-right"
        />

        {/* Basic Components Section */}
        <section className="mb-16">
          <motion.h2
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Basic Components
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Animated Button */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Button</h3>
              <div className="space-y-3">
                <AnimatedButton variant="default" size="sm">
                  Small Button
                </AnimatedButton>
                <AnimatedButton variant="outline" size="md">
                  Medium Button
                </AnimatedButton>
                <AnimatedButton variant="destructive" size="lg">
                  Large Button
                </AnimatedButton>
              </div>
            </AnimatedCard>

            {/* Animated Icon */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Icon</h3>
              <div className="flex space-x-4">
                <AnimatedIcon size="lg" animation="pulse">
                  <Heart className="w-8 h-8" />
                </AnimatedIcon>
                <AnimatedIcon size="lg" animation="bounce">
                  <Star className="w-8 h-8" />
                </AnimatedIcon>
                <AnimatedIcon size="lg" animation="shake">
                  <Zap className="w-8 h-8" />
                </AnimatedIcon>
              </div>
            </AnimatedCard>

            {/* Animated Progress */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Progress</h3>
              <div className="space-y-4">
                <AnimatedProgress value={75} variant="default" showLabel />
                <AnimatedProgress value={60} variant="gradient" />
                <AnimatedProgress value={90} variant="circular" showLabel />
              </div>
            </AnimatedCard>

            {/* Animated Badge */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Badge</h3>
              <div className="flex flex-wrap gap-2">
                <AnimatedBadge variant="primary">Primary</AnimatedBadge>
                <AnimatedBadge variant="success">Success</AnimatedBadge>
                <AnimatedBadge variant="warning">Warning</AnimatedBadge>
                <AnimatedBadge variant="danger">Danger</AnimatedBadge>
                <AnimatedBadge variant="info" pulse>Info</AnimatedBadge>
              </div>
            </AnimatedCard>

            {/* Animated Input */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Input</h3>
              <div className="space-y-4">
                <AnimatedInput
                  label="Email"
                  placeholder="Enter your email"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                />
                <AnimatedInput
                  label="Phone"
                  placeholder="Enter your phone"
                  value=""
                  onChange={() => {}}
                  type="tel"
                  icon={<Phone className="w-4 h-4" />}
                  iconPosition="right"
                />
              </div>
            </AnimatedCard>

            {/* Animated Search */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Search</h3>
              <AnimatedSearch
                placeholder="Search components..."
                onSearch={(query) => console.log('Search:', query)}
                suggestions={searchSuggestions}
                showSuggestions={true}
              />
            </AnimatedCard>
          </div>
        </section>

        {/* Interactive Components Section */}
        <section className="mb-16">
          <motion.h2
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Interactive Components
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Animated Tabs */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Tabs</h3>
              <AnimatedTabs
                tabs={tabItems}
                defaultTab="overview"
                variant="pills"
                onChange={setActiveTab}
              />
            </AnimatedCard>

            {/* Animated Accordion */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Accordion</h3>
              <AnimatedAccordion
                items={accordionItems}
                variant="bordered"
                allowMultiple={true}
                defaultOpen={['item-1']}
              />
            </AnimatedCard>

            {/* Animated Dropdown */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Dropdown</h3>
              <AnimatedDropdown
                options={dropdownOptions}
                placeholder="Select an option"
                onChange={(value) => console.log('Selected:', value)}
                variant="outlined"
              />
            </AnimatedCard>

            {/* Animated Stepper */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Stepper</h3>
              <AnimatedStepper
                steps={stepperSteps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                variant="cards"
                showProgress={true}
              />
            </AnimatedCard>
          </div>
        </section>

        {/* Data Display Section */}
        <section className="mb-16">
          <motion.h2
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Data Display
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Animated Table */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Table</h3>
              <AnimatedTable
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'role', label: 'Role' },
                  { key: 'status', label: 'Status' },
                ]}
                data={tableData}
                onRowClick={(row) => console.log('Row clicked:', row)}
              />
            </AnimatedCard>

            {/* Animated Chart */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Chart</h3>
              <AnimatedChart
                data={chartData}
                type="bar"
                title="Monthly Sales"
                width={400}
                height={300}
              />
            </AnimatedCard>

            {/* Animated Calendar */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Calendar</h3>
              <AnimatedCalendar
                events={calendarEvents}
                onDateSelect={(date) => console.log('Date selected:', date)}
                onEventClick={(event) => console.log('Event clicked:', event)}
                showEvents={true}
                showNavigation={true}
                showToday={true}
              />
            </AnimatedCard>

            {/* Animated Carousel */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Animated Carousel</h3>
              <AnimatedCarousel
                items={carouselItems}
                autoPlay={true}
                showArrows={true}
                showDots={true}
                height={256}
              />
            </AnimatedCard>
          </div>
        </section>

        {/* Feedback Components Section */}
        <section className="mb-16">
          <motion.h2
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Feedback Components
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Buttons */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <div className="space-y-3">
                <AnimatedButton
                  onClick={() => showSuccess('Success!', 'Operation completed successfully')}
                  variant="default"
                >
                  Show Success
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => showError('Error!', 'Something went wrong')}
                  variant="destructive"
                >
                  Show Error
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => showWarning('Warning!', 'Please check your input')}
                  variant="outline"
                >
                  Show Warning
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => showInfo('Info!', 'Here is some information')}
                  variant="outline"
                >
                  Show Info
                </AnimatedButton>
              </div>
            </AnimatedCard>

            {/* Modal and Toast */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Modal & Toast</h3>
              <div className="space-y-3">
                <AnimatedButton
                  onClick={() => setShowModal(true)}
                  variant="default"
                >
                  Open Modal
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => setShowToast(true)}
                  variant="outline"
                >
                  Show Toast
                </AnimatedButton>
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* Loading States Section */}
        <section className="mb-16">
          <motion.h2
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Loading States
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton Components */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Text Skeleton</h3>
              <AnimatedSkeleton variant="text" lines={3} />
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Card Skeleton</h3>
              <AnimatedSkeleton variant="card" />
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Table Skeleton</h3>
              <AnimatedSkeleton variant="table" rows={4} columns={3} />
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Form Skeleton</h3>
              <AnimatedSkeleton variant="form" lines={3} />
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">List Skeleton</h3>
              <AnimatedSkeleton variant="list" lines={3} />
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Avatar Skeleton</h3>
              <AnimatedSkeleton variant="avatar" size="3rem" />
            </AnimatedCard>
          </div>
        </section>

        {/* Utility Components Section */}
        <section className="mb-16">
          <motion.h2
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Utility Components
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tooltip Examples */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tooltips</h3>
              <div className="flex space-x-4">
                <AnimatedTooltip content="This is a tooltip on the left" position="left">
                  <AnimatedButton variant="outline">Left Tooltip</AnimatedButton>
                </AnimatedTooltip>
                <AnimatedTooltip content="This is a tooltip on the top" position="top">
                  <AnimatedButton variant="outline">Top Tooltip</AnimatedButton>
                </AnimatedTooltip>
                <AnimatedTooltip content="This is a tooltip on the right" position="right">
                  <AnimatedButton variant="outline">Right Tooltip</AnimatedButton>
                </AnimatedTooltip>
                <AnimatedTooltip content="This is a tooltip on the bottom" position="bottom">
                  <AnimatedButton variant="outline">Bottom Tooltip</AnimatedButton>
                </AnimatedTooltip>
              </div>
            </AnimatedCard>

            {/* Progress Examples */}
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Progress Variants</h3>
              <div className="space-y-4">
                <AnimatedProgress value={45} variant="striped" />
                <AnimatedProgress value={78} variant="gradient" />
                <AnimatedProgress value={92} variant="circular" showLabel />
              </div>
            </AnimatedCard>
          </div>
        </section>
      </div>

      {/* Modal */}
      <AnimatedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Demo Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is a demo modal showcasing the AnimatedModal component. It includes smooth animations,
            backdrop clicking, and escape key support.
          </p>
          <div className="flex justify-end space-x-3">
            <AnimatedButton
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={() => setShowModal(false)}
            >
              Confirm
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>

      {/* Toast */}
      {showToast && (
        <AnimatedToast
          message="This is a demo toast notification!"
          type="info"
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
