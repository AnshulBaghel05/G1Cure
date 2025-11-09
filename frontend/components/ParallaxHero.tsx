import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Video, 
  CreditCard, 
  BarChart3,
  Activity,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Star,
  ArrowRight,
  Calendar as CalendarIcon
} from 'lucide-react';

interface ParallaxHeroProps {
  onAuthClick: (type: 'login' | 'signup') => void;
}

export function ParallaxHero({ onAuthClick }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const mouseX = useSpring(mousePosition.x, springConfig);
  const mouseY = useSpring(mousePosition.y, springConfig);

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["0%", "75%"]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);

  // Mouse parallax transforms
  const mouseParallax1 = useTransform(mouseX, [-1, 1], [-20, 20]);
  const mouseParallax2 = useTransform(mouseY, [-1, 1], [-20, 20]);
  const mouseParallax3 = useTransform(mouseX, [-1, 1], [-10, 10]);
  const mouseParallax4 = useTransform(mouseY, [-1, 1], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const floatingIcons = [
    { Icon: Users, delay: 0, x: 10, y: 20 },
    { Icon: Calendar, delay: 0.2, x: 80, y: 10 },
    { Icon: Video, delay: 0.4, x: 15, y: 70 },
    { Icon: CreditCard, delay: 0.6, x: 85, y: 60 },
    { Icon: BarChart3, delay: 0.8, x: 50, y: 15 },
    { Icon: Shield, delay: 1, x: 20, y: 45 },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
    >
      {/* Background layers */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Floating icons layer 1 */}
      <motion.div
        style={{ y: layer1Y, x: mouseParallax1, rotateY: mouseParallax2 }}
        className="absolute inset-0 pointer-events-none"
      >
        {floatingIcons.slice(0, 3).map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.6, 
              scale: 1,
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              delay,
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating icons layer 2 */}
      <motion.div
        style={{ y: layer2Y, x: mouseParallax3, rotateX: mouseParallax4 }}
        className="absolute inset-0 pointer-events-none"
      >
        {floatingIcons.slice(3).map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.4, 
              scale: 1,
              y: [0, 15, 0],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ 
              delay: delay + 0.5,
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="w-8 h-8 bg-purple-100/80 dark:bg-purple-900/80 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center">
              <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
      >
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-full px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
          >
            <Zap className="w-4 h-4" />
            Trusted by 500+ Healthcare Providers
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Healthcare Practice
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Complete healthcare management solution with AI-powered features, 
              telemedicine, and advanced analytics for modern medical practices.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => onAuthClick('signup')}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:bg-white/90 dark:hover:bg-gray-700/90 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => onAuthClick('login')}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Book Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free 7-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8"
          >
            {[
              { icon: Activity, label: 'Active Clinics', value: '500+' },
              { icon: Users, label: 'Patients Served', value: '50K+' },
              { icon: Shield, label: 'Data Security', value: '99.9%' },
              { icon: Zap, label: 'Uptime', value: '99.9%' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="text-center space-y-2"
                >
                  <div className="w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative elements layer 3 */}
      <motion.div
        style={{ y: layer3Y }}
        className="absolute inset-0 pointer-events-none opacity-20"
      >
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300 rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-300 rounded-full" />
      </motion.div>
    </div>
  );
}
