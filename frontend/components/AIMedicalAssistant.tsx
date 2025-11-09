import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Bot, 
  Send, 
  Brain, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User,
  MessageCircle,
  FileText,
  Zap,
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';
import backend from '~backend/client';

interface MedicalQuery {
  id: string;
  query: string;
  response: string;
  confidence: number;
  category: 'diagnosis' | 'medication' | 'general' | 'emergency';
  isEmergency: boolean;
  suggestions: string[];
  warnings: string[];
  createdAt: Date;
}

interface DrugInteraction {
  hasInteraction: boolean;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  description: string;
  recommendations: string[];
}

interface AIMedicalAssistantProps {
  patientId?: string;
  currentMedications?: string[];
  medicalHistory?: string;
  onEmergency?: (message: string) => void;
}

export function AIMedicalAssistant({ 
  patientId, 
  currentMedications = [], 
  medicalHistory = '',
  onEmergency 
}: AIMedicalAssistantProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [medicalQueries, setMedicalQueries] = useState<MedicalQuery[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'drug-check' | 'history'>('chat');
  const [newMedication, setNewMedication] = useState('');
  const [drugInteraction, setDrugInteraction] = useState<DrugInteraction | null>(null);
  const [isCheckingDrug, setIsCheckingDrug] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQueries = [
    "I have a headache",
    "What are the symptoms of diabetes?",
    "How to manage stress?",
    "Side effects of common medications",
    "When to see a doctor for fever",
    "Healthy lifestyle tips"
  ];

  const commonSymptoms = [
    "Fever", "Headache", "Cough", "Fatigue", "Nausea", "Dizziness",
    "Chest pain", "Shortness of breath", "Joint pain", "Rash"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [medicalQueries]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await backend.ai.createMedicalQuery({
        query: query.trim(),
        symptoms,
        medicalHistory,
        currentMedications,
      });

      const newQuery: MedicalQuery = {
        id: response.id,
        query: response.query,
        response: response.response,
        confidence: response.confidence,
        category: response.category,
        isEmergency: response.isEmergency,
        suggestions: [], // These would come from the AI response
        warnings: [], // These would come from the AI response
        createdAt: response.createdAt,
      };

      setMedicalQueries(prev => [...prev, newQuery]);
      setQuery('');

      // Check for emergency
      if (response.isEmergency && onEmergency) {
        onEmergency(`Emergency detected: ${response.query}`);
        toast({
          title: 'Emergency Alert',
          description: 'This appears to be an emergency. Please contact emergency services immediately.',
          variant: 'destructive',
        });
      }

      toast({
        title: 'AI Response Generated',
        description: 'Medical AI has provided a response to your query.',
      });

    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast({
        title: 'Query Failed',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkDrugInteraction = async () => {
    if (!newMedication.trim() || currentMedications.length === 0) return;

    setIsCheckingDrug(true);
    try {
      const response = await backend.ai.checkDrugInteractions({
        medications: currentMedications,
        newMedication: newMedication.trim(),
      });

      setDrugInteraction(response);
      setNewMedication('');

      if (response.hasInteraction) {
        toast({
          title: 'Drug Interaction Detected',
          description: `${response.severity} interaction found. Please consult your doctor.`,
          variant: response.severity === 'severe' ? 'destructive' : 'default',
        });
      } else {
        toast({
          title: 'No Interactions Found',
          description: 'No known interactions detected.',
        });
      }

    } catch (error) {
      console.error('Failed to check drug interactions:', error);
      toast({
        title: 'Drug Check Failed',
        description: 'Failed to check drug interactions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingDrug(false);
    }
  };

  const addSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms(prev => [...prev, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diagnosis': return <Brain className="w-4 h-4" />;
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Card className="w-80 bg-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-sm">AI Medical Assistant</CardTitle>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setIsMinimized(false)}>
                <Activity className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-600 mb-2">
              Ask me anything about your health...
            </p>
            <Button size="sm" onClick={() => setIsMinimized(false)} className="w-full">
              Open Assistant
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50 w-96"
    >
      <Card className="bg-white shadow-xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Medical Assistant</CardTitle>
                <p className="text-xs text-gray-500">Powered by advanced AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button size="sm" variant="ghost" onClick={() => setIsMinimized(true)}>
                <Activity className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                ×
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Tabs */}
          <div className="flex space-x-1 mb-4">
            <Button
              size="sm"
              variant={activeTab === 'chat' ? 'default' : 'outline'}
              onClick={() => setActiveTab('chat')}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'drug-check' ? 'default' : 'outline'}
              onClick={() => setActiveTab('drug-check')}
              className="flex-1"
            >
              <Pill className="w-4 h-4 mr-1" />
              Drug Check
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'history' ? 'default' : 'outline'}
              onClick={() => setActiveTab('history')}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-1" />
              History
            </Button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {/* Symptoms */}
              {symptoms.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Current Symptoms:</p>
                  <div className="flex flex-wrap gap-1">
                    {symptoms.map(symptom => (
                      <Badge key={symptom} variant="secondary" className="text-xs">
                        {symptom}
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Symptoms */}
              <div>
                <p className="text-sm font-medium mb-2">Add Symptoms:</p>
                <div className="flex flex-wrap gap-1">
                  {commonSymptoms.map(symptom => (
                    <Button
                      key={symptom}
                      size="sm"
                      variant="outline"
                      onClick={() => addSymptom(symptom)}
                      disabled={symptoms.includes(symptom)}
                      className="text-xs"
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Queries */}
              <div>
                <p className="text-sm font-medium mb-2">Quick Questions:</p>
                <div className="space-y-1">
                  {quickQueries.map((quickQuery, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="ghost"
                      onClick={() => setQuery(quickQuery)}
                      className="w-full justify-start text-xs text-left h-auto p-2"
                    >
                      {quickQuery}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Query Input */}
              <div className="space-y-2">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me about your health..."
                  className="min-h-[80px] resize-none"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleQuery()}
                />
                <Button
                  onClick={handleQuery}
                  disabled={!query.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Ask AI</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Chat History */}
              <div className="max-h-64 overflow-y-auto space-y-3">
                {medicalQueries.map((medicalQuery) => (
                  <div key={medicalQuery.id} className="space-y-2">
                    {/* User Query */}
                    <div className="flex items-start space-x-2">
                      <User className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm bg-blue-50 p-2 rounded-lg">
                          {medicalQuery.query}
                        </p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start space-x-2">
                      <Bot className="w-5 h-5 text-green-600 mt-1" />
                      <div className="flex-1 space-y-2">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm">{medicalQuery.response}</p>
                        </div>
                        
                        {/* Metadata */}
                        <div className="flex items-center space-x-2 text-xs">
                          <Badge className={getConfidenceColor(medicalQuery.confidence)}>
                            {medicalQuery.confidence}% confidence
                          </Badge>
                          <Badge variant="outline" className="flex items-center space-x-1">
                            {getCategoryIcon(medicalQuery.category)}
                            <span>{medicalQuery.category}</span>
                          </Badge>
                          {medicalQuery.isEmergency && (
                            <Badge variant="destructive" className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Emergency</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Drug Check Tab */}
          {activeTab === 'drug-check' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Current Medications:</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {currentMedications.map((med, index) => (
                    <Badge key={index} variant="secondary">
                      {med}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Enter new medication..."
                />
                <Button
                  onClick={checkDrugInteraction}
                  disabled={!newMedication.trim() || currentMedications.length === 0 || isCheckingDrug}
                  className="w-full"
                >
                  {isCheckingDrug ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Checking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Check Interactions</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Drug Interaction Result */}
              {drugInteraction && (
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg ${
                    drugInteraction.hasInteraction 
                      ? drugInteraction.severity === 'severe' 
                        ? 'bg-red-50 border border-red-200' 
                        : 'bg-yellow-50 border border-yellow-200'
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {drugInteraction.hasInteraction ? (
                        <AlertTriangle className={`w-5 h-5 ${
                          drugInteraction.severity === 'severe' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <p className="font-medium">
                        {drugInteraction.hasInteraction 
                          ? `${drugInteraction.severity.toUpperCase()} Interaction Detected`
                          : 'No Interactions Found'
                        }
                      </p>
                    </div>
                    <p className="text-sm">{drugInteraction.description}</p>
                    
                    {drugInteraction.recommendations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Recommendations:</p>
                        <ul className="text-sm space-y-1">
                          {drugInteraction.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {medicalQueries.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No medical queries yet. Start a conversation to see your history.
                </p>
              ) : (
                medicalQueries.map((medicalQuery) => (
                  <div key={medicalQuery.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium truncate">{medicalQuery.query}</p>
                      <Badge className={getConfidenceColor(medicalQuery.confidence)}>
                        {medicalQuery.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {medicalQuery.response}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(medicalQuery.category)}
                        <span>{medicalQuery.category}</span>
                      </div>
                      <span>{new Date(medicalQuery.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
