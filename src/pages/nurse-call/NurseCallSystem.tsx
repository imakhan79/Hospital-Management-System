
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EnhancedNurseCallDashboard from '@/components/nurse-call/EnhancedNurseCallDashboard';
import PatientCallInterface from '@/components/nurse-call/PatientCallInterface';
import PatientCallHistory from '@/components/nurse-call/PatientCallHistory';
import { Bell, Users, Phone, Shield, Zap, Monitor, Clock, AlertTriangle, Activity } from 'lucide-react';

const NurseCallSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const features = [
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Real-time Alerts',
      description: 'Instant notifications with priority levels and automated escalation'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Voice Communication',
      description: 'Two-way voice calls with noise cancellation and call recording'
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'Smart Dashboard',
      description: 'AI-powered analytics with predictive insights and trends'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'HIPAA Compliant',
      description: 'End-to-end encryption with audit trails and compliance reporting'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Ultra-Fast Response',
      description: 'Sub-second delivery with intelligent routing and load balancing'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Multi-facility Support',
      description: 'Scalable across unlimited facilities with centralized management'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Response Time Tracking',
      description: 'Detailed analytics on response times and performance metrics'
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Emergency Protocols',
      description: 'Automated emergency escalation with staff notification chains'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Integration Ready',
      description: 'Seamless integration with EMR, patient monitoring, and hospital systems'
    }
  ];

  const systemStats = [
    { label: 'Active Patients', value: '50', trend: '+5%' },
    { label: 'Response Time', value: '1.2m', trend: '-15s' },
    { label: 'Success Rate', value: '99.8%', trend: '+0.2%' },
    { label: 'Uptime', value: '99.99%', trend: 'Stable' }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Advanced Nurse Call System</h1>
            <p className="text-muted-foreground">
              Next-generation healthcare communication platform with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
              System Online
            </Badge>
            <Badge variant="secondary">
              50 Patients Active
            </Badge>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Nurse Dashboard</TabsTrigger>
            <TabsTrigger value="patient">Patient Interface</TabsTrigger>
            <TabsTrigger value="history">Call History</TabsTrigger>
            <TabsTrigger value="features">System Features</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedNurseCallDashboard />
          </TabsContent>

          <TabsContent value="patient" className="space-y-6">
            <PatientCallInterface
              patientId="patient-1"
              patientName="Muhammad Ali"
              roomNumber="1A01"
              department="General Medicine"
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <PatientCallHistory />
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-medical-100 rounded-lg text-medical-600">
                        {feature.icon}
                      </div>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Advanced System Integration</CardTitle>
                <CardDescription>
                  Comprehensive integration with modern hospital infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Hardware Integration</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Smart bedside call buttons</li>
                      <li>• HD nurse station displays</li>
                      <li>• Mobile devices & tablets</li>
                      <li>• Overhead paging systems</li>
                      <li>• Wearable nurse devices</li>
                      <li>• Emergency pull cords</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Software Integration</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Electronic Health Records (EHR)</li>
                      <li>• Hospital Information Systems</li>
                      <li>• Staff scheduling systems</li>
                      <li>• Patient monitoring systems</li>
                      <li>• Pharmacy management</li>
                      <li>• Billing and insurance</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Advanced Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• AI-powered call prioritization</li>
                      <li>• Predictive analytics</li>
                      <li>• Automatic escalation</li>
                      <li>• Performance dashboards</li>
                      <li>• Compliance reporting</li>
                      <li>• Real-time notifications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics & Analytics</CardTitle>
                <CardDescription>
                  Real-time insights and performance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Key Performance Indicators</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Response Time</span>
                        <Badge variant="secondary">1.2 minutes</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Call Resolution Rate</span>
                        <Badge variant="secondary">99.8%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Patient Satisfaction</span>
                        <Badge variant="secondary">4.9/5.0</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">System Uptime</span>
                        <Badge variant="secondary">99.99%</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Real-time Monitoring</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Calls</span>
                        <Badge className="bg-orange-500">7 pending</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Staff On Duty</span>
                        <Badge className="bg-green-500">23 nurses</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Critical Alerts</span>
                        <Badge className="bg-red-500">2 urgent</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">System Load</span>
                        <Badge className="bg-blue-500">Normal</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NurseCallSystem;
