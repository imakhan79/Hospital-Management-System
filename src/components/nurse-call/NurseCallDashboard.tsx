
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Phone, Clock, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { CallRequest, CallStats } from "@/types/nurseCall";
import { fetchActiveCalls, fetchCallStats, acknowledgeCall, respondToCall, resolveCall } from "@/services/nurseCallService";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const NurseCallDashboard = () => {
  const [activeCalls, setActiveCalls] = useState<CallRequest[]>([]);
  const [callStats, setCallStats] = useState<CallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    // Set up real-time updates (every 30 seconds in this demo)
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [calls, stats] = await Promise.all([
        fetchActiveCalls(),
        fetchCallStats()
      ]);
      setActiveCalls(calls);
      setCallStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load nurse call data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgeCall = async (callId: string) => {
    if (!user) return;
    
    try {
      await acknowledgeCall(callId, user.id, user.name || user.email);
      toast({
        title: "Call Acknowledged",
        description: "You have acknowledged the patient call",
      });
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge call",
        variant: "destructive"
      });
    }
  };

  const handleRespondToCall = async (callId: string) => {
    try {
      await respondToCall(callId);
      toast({
        title: "Responding to Call",
        description: "You are now responding to the patient call",
      });
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to respond to call",
        variant: "destructive"
      });
    }
  };

  const handleResolveCall = async (callId: string) => {
    try {
      await resolveCall(callId, "Call resolved by nurse");
      toast({
        title: "Call Resolved",
        description: "Patient call has been marked as resolved",
      });
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve call",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      case 'assistance': return <Users className="w-4 h-4" />;
      case 'pain': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimeSince = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    return `${minutes}m ago`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading nurse call dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {callStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls Today</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{callStats.total_calls_today}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{callStats.pending_calls}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(callStats.average_response_time / 60)}m</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{callStats.critical_alerts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{callStats.resolved_calls}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Active Calls ({activeCalls.length})
          </CardTitle>
          <CardDescription>
            Real-time patient call requests requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeCalls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No active calls at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeCalls.map((call) => (
                <div key={call.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCallTypeIcon(call.call_type)}
                      <div>
                        <h4 className="font-semibold">{call.patient_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Room {call.room_number} • {call.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(call.priority)}>
                        {call.priority.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeSince(call.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {call.call_type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {call.status.replace('_', ' ')}
                    </Badge>
                    {call.voice_call_enabled && (
                      <Badge variant="outline" className="text-blue-600">
                        <Phone className="w-3 h-3 mr-1" />
                        Voice Call
                      </Badge>
                    )}
                  </div>

                  {call.assigned_nurse_name && (
                    <p className="text-sm text-muted-foreground">
                      Assigned to: {call.assigned_nurse_name}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {call.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAcknowledgeCall(call.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Acknowledge
                      </Button>
                    )}
                    {call.status === 'acknowledged' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleRespondToCall(call.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Respond
                      </Button>
                    )}
                    {call.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleResolveCall(call.id)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {call.voice_call_enabled && (
                      <Button size="sm" variant="outline" className="text-blue-600">
                        <Phone className="w-4 h-4 mr-1" />
                        Call Patient
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NurseCallDashboard;
