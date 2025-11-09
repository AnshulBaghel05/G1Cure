import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  X, 
  User, 
  UserCheck, 
  Shield, 
  Heart, 
  Stethoscope,
  Activity,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'patient' as 'admin' | 'doctor' | 'patient',
    // Doctor specific fields
    specialization: '',
    licenseNumber: '',
    experience: '',
    qualification: '',
    consultationFee: '',
    availability: '',
    bio: '',
    // Patient specific fields
    dateOfBirth: '',
    gender: 'other' as 'male' | 'female' | 'other',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast({
        title: 'Welcome back!',
        description: 'You have been logged in successfully.',
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please check and try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const profileData: any = {};
      
      if (signupData.role === 'doctor') {
        profileData.specialization = signupData.specialization;
        profileData.licenseNumber = signupData.licenseNumber;
        profileData.experience = parseInt(signupData.experience) || 0;
        profileData.qualification = signupData.qualification;
        profileData.consultationFee = parseFloat(signupData.consultationFee) || 0;
        profileData.availability = signupData.availability;
        profileData.bio = signupData.bio;
      } else if (signupData.role === 'patient') {
        profileData.dateOfBirth = signupData.dateOfBirth ? new Date(signupData.dateOfBirth) : new Date();
        profileData.gender = signupData.gender;
        profileData.address = signupData.address;
        profileData.emergencyContact = signupData.emergencyContact;
        profileData.emergencyPhone = signupData.emergencyPhone;
        profileData.medicalHistory = signupData.medicalHistory;
        profileData.allergies = signupData.allergies;
        profileData.currentMedications = signupData.currentMedications;
      }

      await signup({
        email: signupData.email,
        password: signupData.password,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        role: signupData.role,
        profileData,
      });

      toast({
        title: 'Account Created!',
        description: 'Welcome to G1Cure! You have been logged in successfully.',
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleColors = {
    patient: 'from-blue-500 to-cyan-500',
    doctor: 'from-green-500 to-emerald-500',
    admin: 'from-purple-500 to-pink-500',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ backdropFilter: 'blur(12px)' }}
          exit={{ backdropFilter: 'blur(0px)' }}
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
        />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[Heart, Stethoscope, Activity].map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute text-blue-200/20"
              animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, delay: index * 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ left: `${20 + index * 30}%`, top: `${30 + index * 20}%`, fontSize: '4rem' }}
            >
              <Icon />
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
              <div className="absolute inset-0 bg-black/10" />
              
              <div className="relative flex flex-row items-center justify-between space-y-0 pb-4 text-white">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">Welcome to G1Cure</CardTitle>
                  <p className="text-blue-100">Your healthcare journey starts here</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <motion.form 
                    onSubmit={handleLogin} 
                    className="space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="flex items-center gap-2"><Mail className="w-4 h-4" />Email Address</Label>
                      <Input id="login-email" type="email" placeholder="Enter your email" value={loginData.email} onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))} className="h-11" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="flex items-center gap-2"><Lock className="w-4 h-4" />Password</Label>
                      <div className="relative">
                        <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={loginData.password} onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))} className="h-11 pr-10" required />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-11 px-3" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={isLoading}>
                      {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </motion.form>
                </TabsContent>

                <TabsContent value="signup">
                  <motion.form 
                    onSubmit={handleSignup} 
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="signup-firstName">First Name</Label><Input id="signup-firstName" placeholder="John" value={signupData.firstName} onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))} required /></div>
                      <div className="space-y-2"><Label htmlFor="signup-lastName">Last Name</Label><Input id="signup-lastName" placeholder="Doe" value={signupData.lastName} onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))} required /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="signup-email" className="flex items-center gap-2"><Mail className="w-4 h-4" />Email Address</Label><Input id="signup-email" type="email" placeholder="john.doe@example.com" value={signupData.email} onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="signup-password">Password</Label><div className="relative"><Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={signupData.password} onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))} className="pr-10" required /><Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button></div></div>
                      <div className="space-y-2"><Label htmlFor="signup-confirmPassword">Confirm Password</Label><div className="relative"><Input id="signup-confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={signupData.confirmPassword} onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="pr-10" required /><Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button></div></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="signup-role">I am a</Label><Select value={signupData.role} onValueChange={(value) => setSignupData(prev => ({ ...prev, role: value as any }))}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="patient"><div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full bg-gradient-to-r ${roleColors.patient} flex items-center justify-center`}><User className="w-3 h-3 text-white" /></div><div><div className="font-medium">Patient</div><div className="text-xs text-gray-500">Seeking healthcare services</div></div></div></SelectItem><SelectItem value="doctor"><div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full bg-gradient-to-r ${roleColors.doctor} flex items-center justify-center`}><UserCheck className="w-3 h-3 text-white" /></div><div><div className="font-medium">Doctor</div><div className="text-xs text-gray-500">Healthcare professional</div></div></div></SelectItem><SelectItem value="admin"><div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full bg-gradient-to-r ${roleColors.admin} flex items-center justify-center`}><Shield className="w-3 h-3 text-white" /></div><div><div className="font-medium">Administrator</div><div className="text-xs text-gray-500">Clinic management</div></div></div></SelectItem></SelectContent></Select></div>
                    <AnimatePresence mode="wait">{signupData.role === 'doctor' && (<motion.div key="doctor-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-4 border-t pt-4"><div className="flex items-center gap-2 text-sm font-medium text-green-600"><Stethoscope className="w-4 h-4" />Doctor Information</div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="specialization">Specialization</Label><Input id="specialization" placeholder="Cardiology" value={signupData.specialization} onChange={(e) => setSignupData(prev => ({ ...prev, specialization: e.target.value }))} /></div><div className="space-y-2"><Label htmlFor="licenseNumber">License Number</Label><Input id="licenseNumber" placeholder="MED123456" value={signupData.licenseNumber} onChange={(e) => setSignupData(prev => ({ ...prev, licenseNumber: e.target.value }))} /></div></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="experience">Experience (Years)</Label><Input id="experience" type="number" placeholder="5" value={signupData.experience} onChange={(e) => setSignupData(prev => ({ ...prev, experience: e.target.value }))} /></div><div className="space-y-2"><Label htmlFor="consultationFee">Consultation Fee (₹)</Label><Input id="consultationFee" type="number" placeholder="500" value={signupData.consultationFee} onChange={(e) => setSignupData(prev => ({ ...prev, consultationFee: e.target.value }))} /></div></div></motion.div>)}{signupData.role === 'patient' && (<motion.div key="patient-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-4 border-t pt-4"><div className="flex items-center gap-2 text-sm font-medium text-blue-600"><Heart className="w-4 h-4" />Patient Information</div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="dateOfBirth">Date of Birth</Label><Input id="dateOfBirth" type="date" value={signupData.dateOfBirth} onChange={(e) => setSignupData(prev => ({ ...prev, dateOfBirth: e.target.value }))} /></div><div className="space-y-2"><Label htmlFor="gender">Gender</Label><Select value={signupData.gender} onValueChange={(value) => setSignupData(prev => ({ ...prev, gender: value as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div></div><div className="space-y-2"><Label htmlFor="emergencyContact">Emergency Contact</Label><Input id="emergencyContact" placeholder="Emergency contact name" value={signupData.emergencyContact} onChange={(e) => setSignupData(prev => ({ ...prev, emergencyContact: e.target.value }))} /></div></motion.div>)}</AnimatePresence>
                    <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={isLoading}>
                      {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </motion.form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
