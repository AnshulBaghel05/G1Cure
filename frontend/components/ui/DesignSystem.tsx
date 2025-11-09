import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Ruler, Grid, Eye, EyeOff } from 'lucide-react';

// Design System Constants
export const colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },
  
  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  
  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },
  
  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  
  // Healthcare Specific Colors
  healthcare: {
    blue: '#1e40af',
    teal: '#0d9488',
    purple: '#7c3aed',
    pink: '#ec4899',
    indigo: '#4f46e5',
    cyan: '#0891b2'
  }
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem'      // 128px
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }
};

export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem'     // 256px
};

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none'
};

export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// Design System Showcase Component
interface DesignSystemShowcaseProps {
  className?: string;
}

export function DesignSystemShowcase({ className = '' }: DesignSystemShowcaseProps) {
  const [activeTab, setActiveTab] = React.useState<'colors' | 'typography' | 'spacing' | 'shadows'>('colors');

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'spacing', label: 'Spacing', icon: Ruler },
    { id: 'shadows', label: 'Shadows', icon: Grid }
  ];

  const renderColors = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(colors.primary).map(([key, value]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div
                className="w-16 h-16 rounded-lg border border-gray-200 mb-2"
                style={{ backgroundColor: value }}
              />
              <p className="text-xs font-mono">{key}</p>
              <p className="text-xs text-gray-500">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Healthcare Colors</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(colors.healthcare).map(([key, value]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-lg border border-gray-200 mb-2"
                style={{ backgroundColor: value }}
              />
              <p className="text-sm font-medium capitalize">{key}</p>
              <p className="text-xs text-gray-500 font-mono">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTypography = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Font Sizes</h3>
        <div className="space-y-4">
          {Object.entries(typography.fontSize).slice(0, 8).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">text-{key}</span>
              <span className="text-gray-500 font-mono">{value}</span>
              <span style={{ fontSize: value }} className="font-medium">
                The quick brown fox jumps over the lazy dog
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Font Weights</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(typography.fontWeight).map(([key, value]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">font-{key}</p>
              <p style={{ fontWeight: value }} className="text-lg">
                The quick brown fox
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSpacing = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Spacing Scale</h3>
        <div className="space-y-4">
          {Object.entries(spacing).slice(0, 12).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-mono text-gray-600">
                {key}
              </div>
              <div className="w-20 text-sm font-mono text-gray-500">
                {value}
              </div>
              <div
                className="bg-blue-500 rounded"
                style={{ width: value, height: '1rem' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Border Radius</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(borderRadius).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="w-16 h-16 bg-blue-500 mx-auto mb-2"
                style={{ borderRadius: value }}
              />
              <p className="text-xs font-mono">{key}</p>
              <p className="text-xs text-gray-500">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShadows = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Shadow Variants</h3>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(shadows).map(([key, value]) => (
            <div key={key} className="p-6 bg-white rounded-lg border border-gray-200">
              <p className="text-sm font-medium mb-3 capitalize">{key}</p>
              <div
                className="w-24 h-24 bg-gray-100 rounded-lg mx-auto"
                style={{ boxShadow: value }}
              />
              <p className="text-xs font-mono text-gray-500 mt-2 break-all">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'colors':
        return renderColors();
      case 'typography':
        return renderTypography();
      case 'spacing':
        return renderSpacing();
      case 'shadows':
        return renderShadows();
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          G1Cure Design System
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive design tokens and components for consistent healthcare UI
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
}

// Color Palette Component
export function ColorPalette() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(colors).map(([category, colorSet]) => (
        <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
            {category} Colors
          </h3>
          <div className="space-y-2">
            {Object.entries(colorSet).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded border border-gray-200"
                  style={{ backgroundColor: value }}
                />
                <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                  {key}
                </span>
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Typography Scale Component
export function TypographyScale() {
  return (
    <div className="space-y-6">
      {Object.entries(typography.fontSize).map(([key, value]) => (
        <div key={key} className="border-b border-gray-200 dark:border-gray-600 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              text-{key}
            </span>
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              {value}
            </span>
          </div>
          <p style={{ fontSize: value }} className="font-medium text-gray-900 dark:text-white">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      ))}
    </div>
  );
}
