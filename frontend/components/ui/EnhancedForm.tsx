import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
}

interface FormConfig {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  submitText?: string;
  loadingText?: string;
  className?: string;
  showValidation?: boolean;
  autoFocus?: boolean;
}

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitError?: string;
  submitSuccess?: boolean;
}

export function EnhancedForm({
  fields,
  onSubmit,
  submitText = 'Submit',
  loadingText = 'Submitting...',
  className = '',
  showValidation = true,
  autoFocus = false
}: FormConfig) {
  const [formState, setFormState] = useState<FormState>({
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false,
    submitError: undefined,
    submitSuccess: false
  });

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Initialize form values
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialValues[field.name] = false;
      } else if (field.type === 'select') {
        initialValues[field.name] = field.options?.[0]?.value || '';
      } else {
        initialValues[field.name] = '';
      }
    });
    setFormState(prev => ({ ...prev, values: initialValues }));
  }, [fields]);

  // Validation function
  const validateField = useCallback((name: string, value: any): string | null => {
    const field = fields.find(f => f.name === name);
    if (!field) return null;

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }

    // Skip validation if no value and not required
    if (!value && !field.required) return null;

    // Pattern validation
    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      return `${field.label} format is invalid`;
    }

    // Length validation
    if (field.validation?.minLength && value.length < field.validation.minLength) {
      return `${field.label} must be at least ${field.validation.minLength} characters`;
    }

    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      return `${field.label} must be no more than ${field.validation.maxLength} characters`;
    }

    // Number validation
    if (field.validation?.min !== undefined && Number(value) < field.validation.min) {
      return `${field.label} must be at least ${field.validation.min}`;
    }

    if (field.validation?.max !== undefined && Number(value) > field.validation.max) {
      return `${field.label} must be no more than ${field.validation.max}`;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Custom validation
    if (field.validation?.custom) {
      const customError = field.validation.custom(value);
      if (customError) return customError;
    }

    return null;
  }, [fields]);

  // Handle field change
  const handleFieldChange = useCallback((name: string, value: any) => {
    setFormState(prev => {
      const newValues = { ...prev.values, [name]: value };
      const newErrors = { ...prev.errors };
      
      // Clear error when field is modified
      if (newErrors[name]) {
        delete newErrors[name];
      }

      // Validate field if it's been touched
      if (prev.touched[name]) {
        const error = validateField(name, value);
        if (error) {
          newErrors[name] = error;
        }
      }

      return {
        ...prev,
        values: newValues,
        errors: newErrors,
        submitError: undefined,
        submitSuccess: false
      };
    });
  }, [validateField]);

  // Handle field blur
  const handleFieldBlur = useCallback((name: string) => {
    setFormState(prev => {
      const newTouched = { ...prev.touched, [name]: true };
      const newErrors = { ...prev.errors };
      
      const error = validateField(name, prev.values[name]);
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }

      return {
        ...prev,
        touched: newTouched,
        errors: newErrors
      };
    });
  }, [validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field.name, formState.values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormState(prev => ({
        ...prev,
        errors: newErrors,
        touched: Object.fromEntries(fields.map(f => [f.name, true]))
      }));
      return;
    }

    // Submit form
    setFormState(prev => ({ ...prev, isSubmitting: true, submitError: undefined }));
    
    try {
      const result = await onSubmit(formState.values);
      
      if (result.success) {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          submitSuccess: true
        }));
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormState(prev => ({
            ...prev,
            submitSuccess: false,
            values: Object.fromEntries(fields.map(f => [
              f.name,
              f.type === 'checkbox' ? false : f.type === 'select' ? f.options?.[0]?.value || '' : ''
            ])),
            touched: {},
            errors: {}
          }));
        }, 2000);
      } else {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          submitError: result.error
        }));
      }
    } catch (error: any) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitError: error.message || 'An unexpected error occurred'
      }));
    }
  }, [formState.values, onSubmit, validateField, fields]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback((fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  }, []);

  // Render field
  const renderField = (field: FormField) => {
    const value = formState.values[field.name];
    const error = formState.errors[field.name];
    const touched = formState.touched[field.name];
    const hasError = touched && error;
    const isValid = touched && !error && value;

    const baseClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      hasError
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : isValid
        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }`;

    const renderInput = () => {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              name={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              className={`${baseClasses} resize-none`}
              autoFocus={autoFocus && field.name === fields[0].name}
            />
          );

        case 'select':
          return (
            <select
              name={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              className={baseClasses}
              autoFocus={autoFocus && field.name === fields[0].name}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'checkbox':
          return (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name={field.name}
                checked={value}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                onBlur={() => handleFieldBlur(field.name)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                autoFocus={autoFocus && field.name === fields[0].name}
              />
              <span className="text-sm text-gray-700">{field.label}</span>
            </div>
          );

        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    onBlur={() => handleFieldBlur(field.name)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          );

        case 'password':
          return (
            <div className="relative">
              <input
                type={showPasswords[field.name] ? 'text' : 'password'}
                name={field.name}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                onBlur={() => handleFieldBlur(field.name)}
                placeholder={field.placeholder}
                className={`${baseClasses} pr-12`}
                autoFocus={autoFocus && field.name === fields[0].name}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field.name)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords[field.name] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          );

        default:
          return (
            <input
              type={field.type}
              name={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              className={baseClasses}
              autoFocus={autoFocus && field.name === fields[0].name}
            />
          );
      }
    };

    return (
      <motion.div
        key={field.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`space-y-2 ${field.className || ''}`}
      >
        {field.type !== 'checkbox' && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {renderInput()}
        
        {showValidation && (
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center space-x-2 text-sm text-red-600"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            
            {isValid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center space-x-2 text-sm text-green-600"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Valid</span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Form Fields */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {renderField(field)}
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: fields.length * 0.1 }}
      >
        <AnimatedButton
          type="submit"
          disabled={formState.isSubmitting}
          loading={formState.isSubmitting}
          className="w-full"
        >
          {formState.isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{loadingText}</span>
            </div>
          ) : (
            submitText
          )}
        </AnimatedButton>
      </motion.div>

      {/* Submit Status */}
      <AnimatePresence>
        {formState.submitError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{formState.submitError}</span>
            </div>
          </motion.div>
        )}

        {formState.submitSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Form submitted successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
