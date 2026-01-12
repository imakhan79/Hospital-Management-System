
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Phone, Clock, User, AlertTriangle, CheckCircle, Volume2, MessageSquare, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnhancedNurseCallDashboard = () => {
  const [activeCalls, setActiveCalls] = useState([]);
  const [callStats, setCallStats] = useState({
    totalCalls: 127,
    pendingCalls: 8,
    avgResponseTime: 72,
    criticalAlerts: 2
  });
  const { toast } = useToast();

  // Mock active calls data
  useEffect(() => {
    const mockCalls = [
      {
        id: '1',
        patient_name: 'John Doe',
        room_number: '302A',
        department: 'Cardiology',
        call_type: 'emergency',
        priority: 'critical',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        status: 'pending',
        assigned_nurse_name: null
      },
      {
        id: '2',
        patient_name: 'Mary Smith',
        room_number: '205B',
        department: 'General Medicine',
        call_type: 'assistance',
        priority: 'medium',
        timestamp: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
        status: 'acknowledged',
        assigned_nurse_name: 'Nurse Johnson'
      },
      {
        id: '3',
        patient_name: 'Robert Brown',
        room_number: '401C',
        department: 'Surgery',
        call_type: 'pain',
        priority: 'high',
        timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
        status: 'in_progress',
        assigned_nurse_name: 'Nurse Wilson'
      },
      {
        id: '4',
        patient_name: 'Sarah Johnson',
        room_number: '105A',
        department: 'Emergency',
        call_type: 'bathroom',
        priority: 'low',
        timestamp: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
        status: 'pending',
        assigned_nurse_name: null
      }
    ];
    setActiveCalls(mockCalls);
  }, []);

  const handleAcknowledgeCall = (callId) => {
    setActiveCalls(calls => 
      calls.map(call => 
        call.id === callId 
          ? { ...call, status: 'acknowledged', assigned_nurse_name: 'Current User' }
          : call
      )
    );
    toast({
      title: "Call Acknowledged",
      description: "You have acknowledged the patient call.",
    });
  };

  const handleRespondToCall = (callId) => {
    setActiveCalls(calls => 
      calls.map(call => 
        call.id === callId 
          ? { ...call, status: 'in_progress' }
          : call
      )
    );
    toast({
      title: "Responding to Call",
      description: "You are now responding to the patient call.",
    });
  };

  const handleResolveCall = (callId) => {
    setActiveCalls(calls => calls.filter(call => call.id !== callId));
    setCallStats(stats => ({
      ...stats,
      totalCalls: stats.totalCalls + 1,
      pendingCalls: Math.max(0, stats.pendingCalls - 1)
    }));
    toast({
      title: "Call Resolved",
      description: "The patient call has been marked as resolved.",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCallTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'pain': return <AlertTriangle className="h-4 w-4" />;
      case 'assistance': return <User className="h-4 w-4" />;
      case 'bathroom': return <User className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTimeSince = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return minutes > 0 ? `${minutes}m ${seconds}s ago` : `${seconds}s ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'acknowledged': return 'secondary';
      case 'in_progress': return 'default';
      case 'resolved': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCalls.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeCalls.filter(c => c.status === 'pending').length} pending response
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callStats.avgResponseTime}s</div>
            <p className="text-xs text-muted-foreground">
              Target: &lt;60s
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{callStats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callStats.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="active">Active Calls</TabsTrigger>
          <TabsTrigger value="staff">Staff Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {/* Active Calls List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Active Patient Calls
              </CardTitle>
              <CardDescription>
                {activeCalls.length} active calls requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCalls.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active calls at the moment</p>
                    <p className="text-sm">All patients are attended to</p>
                  </div>
                ) : (
                  activeCalls.map((call) => (
                    <div key={call.id} className="border rounded-lg p-4 space-y-3">
                      {/* Call Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getCallTypeIcon(call.call_type)}
                            <span className="font-semibold">{call.patient_name}</span>
                            <Badge variant={getPriorityColor(call.priority)}>
                              {call.priority}
                            </Badge>
                            <Badge variant={getStatusColor(call.status)}>
                              {call.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Room {call.room_number} • {call.department} • {getTimeSince(call.timestamp)}
                          </div>
                          {call.assigned_nurse_name && (
                            <div className="text-sm text-blue-600">
                              Assigned to: {call.assigned_nurse_name}
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {call.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAcknowledgeCall(call.id)}
                              >
                                <Bell className="h-3 w-3 mr-1" />
                                Acknowledge
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleRespondToCall(call.id)}
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Respond
                              </Button>
                            </>
                          )}
                          
                          {call.status === 'acknowledged' && (
                            <Button 
                              size="sm"
                              onClick={() => handleRespondToCall(call.id)}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Respond
                            </Button>
                          )}
                          
                          {call.status === 'in_progress' && (
                            <>
                              <Button variant="outline" size="sm">
                                <Volume2 className="h-3 w-3 mr-1" />
                                Voice Call
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleResolveCall(call.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolve
                              </Button>
                            </>
                          )}
                          
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Notes
                          </Button>
                        </div>
                      </div>
                      
                      {/* Call Details */}
                      <div className="bg-muted/50 rounded p-3">
                        <div className="text-sm">
                          <strong>Call Type:</strong> {call.call_type.charAt(0).toUpperCase() + call.call_type.slice(1)}
                        </div>
                        <div className="text-sm mt-1">
                          <strong>Request:</strong> Patient requires {call.call_type === 'emergency' ? 'immediate medical attention' : 
                            call.call_type === 'assistance' ? 'nursing assistance' :
                            call.call_type === 'pain' ? 'pain management' :
                            call.call_type === 'bathroom' ? 'bathroom assistance' : 'general assistance'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Nursing Staff Status
                </CardTitle>
                <CardDescription>
                  Current availability and workload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Nurse Johnson', status: 'Available', calls: 0, department: 'General Medicine' },
                    { name: 'Nurse Wilson', status: 'Busy', calls: 2, department: 'Surgery' },
                    { name: 'Nurse Davis', status: 'Available', calls: 1, department: 'Emergency' },
                    { name: 'Nurse Brown', status: 'On Break', calls: 0, department: 'Cardiology' }
                  ].map((nurse, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{nurse.name}</div>
                        <div className="text-sm text-muted-foreground">{nurse.department}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          nurse.status === 'Available' ? 'default' :
                          nurse.status === 'Busy' ? 'destructive' : 'outline'
                        }>
                          {nurse.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {nurse.calls} active calls
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Load</CardTitle>
                <CardDescription>
                  Call distribution across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { department: 'Emergency', calls: 3, capacity: 5 },
                    { department: 'Surgery', calls: 2, capacity: 4 },
                    { department: 'General Medicine', calls: 2, capacity: 6 },
                    { department: 'Cardiology', calls: 1, capacity: 3 }
                  ].map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{dept.department}</span>
                        <span className="text-sm text-muted-foreground">
                          {dept.calls}/{dept.capacity}
                        </span>
                      </div>
                      <Progress value={(dept.calls / dept.capacity) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Metrics</CardTitle>
                <CardDescription>
                  Performance tracking for call responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Response Time</span>
                    <span className="font-bold">{callStats.avgResponseTime}s</span>
                  </div>
                  <Progress value={(callStats.avgResponseTime / 120) * 100} />
                  
                  <div className="flex justify-between items-center">
                    <span>Calls Under 60s</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <Progress value={78} />
                  
                  <div className="flex justify-between items-center">
                    <span>Critical Response Time</span>
                    <span className="font-bold">32s</span>
                  </div>
                  <Progress value={(32 / 60) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call Type Distribution</CardTitle>
                <CardDescription>
                  Most common types of patient calls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Assistance', count: 45, percentage: 35 },
                    { type: 'Pain Management', count: 32, percentage: 25 },
                    { type: 'Bathroom', count: 28, percentage: 22 },
                    { type: 'Emergency', count: 15, percentage: 12 },
                    { type: 'Medication', count: 8, percentage: 6 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.type}</div>
                        <div className="text-sm text-muted-foreground">{item.count} calls</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.percentage}%</div>
                        <Progress value={item.percentage} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedNurseCallDashboard;
