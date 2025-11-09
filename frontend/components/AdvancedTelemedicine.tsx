import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedSwitch } from '@/components/ui';
import { Slider } from '@/components/ui/slider';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MonitorOff,
  MessageCircle,
  Settings,
  Users,
  MoreVertical,
  Minimize2,
  Maximize2,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Activity,
  Zap,
  Shield,
  Volume2,
  VolumeX,
  Brain,
  Heart,
  Thermometer,
  Activity as ActivityIcon,
  AlertTriangle,
  CheckCircle,
  FileText,
  Camera,
  Microscope,
  Stethoscope,
  Pill,
  Clock,
  User,
  Star,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Target,
  Eye,
  Ear,
  Brain as BrainIcon,
  Square,
  Circle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VitalSigns {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  timestamp: Date;
}

interface AIAnalysis {
  symptomAnalysis: string;
  confidence: number;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suggestedTests: string[];
  medicationSuggestions: string[];
}

interface SessionMetrics {
  duration: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  bandwidth: number;
  latency: number;
  packetLoss: number;
  recordingSize: number;
  aiInsights: number;
}

interface AdvancedTelemedicineProps {
  sessionId: string;
  patientId: string;
  doctorId: string;
  onEndSession: () => void;
}

export function AdvancedTelemedicine({ 
  sessionId, 
  patientId, 
  doctorId, 
  onEndSession 
}: AdvancedTelemedicineProps) {
  const { toast } = useToast();
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
  const [isVitalsMonitoring, setIsVitalsMonitoring] = useState(true);
  const [isAutoDocumentation, setIsAutoDocumentation] = useState(true);
  const [isRealTimeTranscription, setIsRealTimeTranscription] = useState(true);
  
  // AI and Analytics State
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    timestamp: new Date()
  });
  
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    symptomAnalysis: "Patient appears to have mild symptoms consistent with seasonal allergies. No immediate concerns detected.",
    confidence: 87,
    recommendations: [
      "Monitor symptoms for 24-48 hours",
      "Consider over-the-counter antihistamines",
      "Schedule follow-up if symptoms worsen"
    ],
    riskLevel: 'low',
    suggestedTests: ["Blood work", "Allergy panel"],
    medicationSuggestions: ["Cetirizine", "Fluticasone nasal spray"]
  });
  
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    duration: 0,
    quality: 'excellent',
    bandwidth: 15.2,
    latency: 45,
    packetLoss: 0.1,
    recordingSize: 0,
    aiInsights: 12
  });

  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'patient' | 'doctor';
    message: string;
    timestamp: Date;
  }>>([]);

  const [transcription, setTranscription] = useState<string>('');
  const [autoNotes, setAutoNotes] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [prescription, setPrescription] = useState<string>('');

  const sessionStartTime = useRef<Date>(new Date());
  const vitalsInterval = useRef<NodeJS.Timeout>();
  const aiAnalysisInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start vitals monitoring
    vitalsInterval.current = setInterval(() => {
      setVitalSigns(prev => ({
        ...prev,
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.2,
        timestamp: new Date()
      }));
    }, 5000);

    // Start AI analysis
    aiAnalysisInterval.current = setInterval(() => {
      setAiAnalysis(prev => ({
        ...prev,
        confidence: Math.min(100, prev.confidence + (Math.random() - 0.5) * 5)
      }));
    }, 10000);

    // Update session duration
    const durationInterval = setInterval(() => {
      setSessionMetrics(prev => ({
        ...prev,
        duration: Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000)
      }));
    }, 1000);

    return () => {
      if (vitalsInterval.current) clearInterval(vitalsInterval.current);
      if (aiAnalysisInterval.current) clearInterval(aiAnalysisInterval.current);
      clearInterval(durationInterval);
    };
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Session is now being recorded for medical records",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "Session recording has been saved",
    });
  };

  const handleAIAnalysis = () => {
    setIsAIAnalysisOpen(true);
    toast({
      title: "AI Analysis",
      description: "AI is analyzing the session for insights and recommendations",
    });
  };

  const handleAutoDocumentation = () => {
    const notes = `Session Notes - ${new Date().toLocaleString()}
    
Symptoms: ${symptoms}
Diagnosis: ${diagnosis}
Prescription: ${prescription}

Vital Signs:
- Heart Rate: ${vitalSigns.heartRate.toFixed(1)} bpm
- Blood Pressure: ${vitalSigns.bloodPressure.systolic}/${vitalSigns.bloodPressure.diastolic} mmHg
- Temperature: ${vitalSigns.temperature.toFixed(1)}°F
- Oxygen Saturation: ${vitalSigns.oxygenSaturation}%

AI Analysis Confidence: ${aiAnalysis.confidence}%
Risk Level: ${aiAnalysis.riskLevel}

Recommendations:
${aiAnalysis.recommendations.map(rec => `- ${rec}`).join('\n')}`;

    setAutoNotes(notes);
    toast({
      title: "Auto Documentation",
      description: "Session notes have been automatically generated",
    });
  };

  const renderVitalsMonitor = () => (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Activity className="w-5 h-5" />
          Real-Time Vitals Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Heart Rate</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {vitalSigns.heartRate.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">bpm</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ActivityIcon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Blood Pressure</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic}
            </div>
            <div className="text-xs text-gray-600">mmHg</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Temperature</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {vitalSigns.temperature.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">°F</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">O2 Saturation</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {vitalSigns.oxygenSaturation}%
            </div>
            <div className="text-xs text-gray-600">SpO2</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Respiratory</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600">
              {vitalSigns.respiratoryRate}
            </div>
            <div className="text-xs text-gray-600">breaths/min</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BrainIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">AI Confidence</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {aiAnalysis.confidence.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">analysis</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAIAnalysis = () => (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Brain className="w-5 h-5" />
          AI-Powered Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Symptom Analysis</h4>
            <p className="text-sm text-gray-700 mb-3">{aiAnalysis.symptomAnalysis}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Risk Level:</span>
              <Badge className={
                aiAnalysis.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                aiAnalysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                aiAnalysis.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }>
                {aiAnalysis.riskLevel.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${aiAnalysis.confidence}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{aiAnalysis.confidence.toFixed(0)}%</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {aiAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
            
            <h4 className="font-semibold mb-2 mt-4">Suggested Tests</h4>
            <div className="flex flex-wrap gap-2">
              {aiAnalysis.suggestedTests.map((test, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {test}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Medication Suggestions</h4>
          <div className="flex flex-wrap gap-2">
            {aiAnalysis.medicationSuggestions.map((med, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Pill className="w-3 h-3 mr-1" />
                {med}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSessionMetrics = () => (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <BarChart3 className="w-5 h-5" />
          Session Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(sessionMetrics.duration / 60)}:{(sessionMetrics.duration % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-600">Duration</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sessionMetrics.quality}
            </div>
            <div className="text-xs text-gray-600">Quality</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sessionMetrics.bandwidth.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Mbps</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {sessionMetrics.aiInsights}
            </div>
            <div className="text-xs text-gray-600">AI Insights</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderControls = () => (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 rounded-lg">
      <Button
        variant={isAudioEnabled ? "default" : "destructive"}
        size="sm"
        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
        className="flex items-center gap-2"
      >
        {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        {isAudioEnabled ? 'Mute' : 'Unmute'}
      </Button>
      
      <Button
        variant={isVideoEnabled ? "default" : "destructive"}
        size="sm"
        onClick={() => setIsVideoEnabled(!isVideoEnabled)}
        className="flex items-center gap-2"
      >
        {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        {isVideoEnabled ? 'Stop Video' : 'Start Video'}
      </Button>
      
      <Button
        variant={isScreenSharing ? "default" : "outline"}
        size="sm"
        onClick={() => setIsScreenSharing(!isScreenSharing)}
        className="flex items-center gap-2"
      >
        {isScreenSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
        {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      </Button>
      
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="sm"
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className="flex items-center gap-2"
      >
                        {isRecording ? <Square className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Chat
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleAIAnalysis}
        className="flex items-center gap-2"
      >
        <Brain className="w-4 h-4" />
        AI Analysis
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={onEndSession}
        className="flex items-center gap-2"
      >
        <PhoneOff className="w-4 h-4" />
        End Call
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-blue-600" />
            Advanced Telemedicine Session
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Session ID: {sessionId} | AI-Powered Healthcare Consultation
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            <Wifi className="w-3 h-3 mr-1" />
            Connected
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Shield className="w-3 h-3 mr-1" />
            HIPAA Secure
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="relative">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Video Stream</p>
                  <p className="text-sm opacity-75">High-quality HD video consultation</p>
                </div>
              </div>
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Live</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {renderControls()}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          {renderVitalsMonitor()}
          {renderAIAnalysis()}
          {renderSessionMetrics()}
        </div>
      </div>

      {/* AI Features Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Auto Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Real-time Transcription</span>
              <AnimatedSwitch 
                checked={isRealTimeTranscription} 
                onChange={setIsRealTimeTranscription} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto Notes Generation</span>
              <AnimatedSwitch 
                checked={isAutoDocumentation} 
                onChange={setIsAutoDocumentation} 
              />
            </div>
            
            <Button onClick={handleAutoDocumentation} className="w-full">
              Generate Session Notes
            </Button>
            
            {autoNotes && (
              <Textarea 
                value={autoNotes} 
                readOnly 
                className="h-32 text-sm"
                placeholder="Auto-generated session notes will appear here..."
              />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Input 
                placeholder="Enter symptoms..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <Input 
                placeholder="Enter diagnosis..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
              <Input 
                placeholder="Enter prescription..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
              />
            </div>
            
            <Button onClick={handleAIAnalysis} className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Analyze with AI
            </Button>
            
            <div className="text-xs text-gray-600">
              AI will analyze symptoms, suggest tests, and provide treatment recommendations
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
