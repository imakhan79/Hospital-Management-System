
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  FlaskConical,
  Pill,
  Receipt,
  BedDouble,
  Stethoscope,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Activity
} from "lucide-react";

export interface ModuleStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  lastSync: string;
  activeUsers: number;
  pendingTasks: number;
  completedToday: number;
  icon: any;
  color: string;
}

export interface DataFlow {
  from: string;
  to: string;
  type: 'patient' | 'order' | 'result' | 'billing';
  count: number;
  status: 'active' | 'pending' | 'error';
}

interface ModuleIntegrationProps {
  showDetailedView?: boolean;
}

export const ModuleIntegration = ({ showDetailedView = false }: ModuleIntegrationProps) => {
  const [modules, setModules] = useState<ModuleStatus[]>([]);
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([]);
  const [systemHealth, setSystemHealth] = useState(95);

  useEffect(() => {
    const moduleData: ModuleStatus[] = [
      {
        id: 'opd',
        name: 'OPD Management',
        status: 'online',
        lastSync: new Date().toISOString(),
        activeUsers: 23,
        pendingTasks: 12,
        completedToday: 156,
        icon: Calendar,
        color: 'text-blue-600'
      },
      {
        id: 'ipd',
        name: 'IPD Management',
        status: 'online',
        lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        activeUsers: 18,
        pendingTasks: 8,
        completedToday: 89,
        icon: BedDouble,
        color: 'text-purple-600'
      },
      {
        id: 'laboratory',
        name: 'Laboratory',
        status: 'warning',
        lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        activeUsers: 12,
        pendingTasks: 23,
        completedToday: 78,
        icon: FlaskConical,
        color: 'text-orange-600'
      },
      {
        id: 'pharmacy',
        name: 'Pharmacy',
        status: 'online',
        lastSync: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        activeUsers: 8,
        pendingTasks: 5,
        completedToday: 134,
        icon: Pill,
        color: 'text-green-600'
      },
      {
        id: 'billing',
        name: 'Billing & Finance',
        status: 'online',
        lastSync: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        activeUsers: 15,
        pendingTasks: 18,
        completedToday: 245,
        icon: Receipt,
        color: 'text-pink-600'
      },
      {
        id: 'clinical',
        name: 'Clinical Records',
        status: 'online',
        lastSync: new Date().toISOString(),
        activeUsers: 34,
        pendingTasks: 7,
        completedToday: 167,
        icon: FileText,
        color: 'text-indigo-600'
      }
    ];

    const flowData: DataFlow[] = [
      { from: 'OPD', to: 'Laboratory', type: 'order', count: 23, status: 'active' },
      { from: 'Laboratory', to: 'Clinical', type: 'result', count: 18, status: 'active' },
      { from: 'OPD', to: 'Pharmacy', type: 'order', count: 45, status: 'active' },
      { from: 'IPD', to: 'Pharmacy', type: 'order', count: 12, status: 'active' },
      { from: 'Clinical', to: 'Billing', type: 'billing', count: 89, status: 'active' },
      { from: 'Laboratory', to: 'Billing', type: 'billing', count: 34, status: 'pending' },
      { from: 'OPD', to: 'IPD', type: 'patient', count: 8, status: 'active' }
    ];

    setModules(moduleData);
    setDataFlows(flowData);

    // Update system health based on module statuses
    const onlineCount = moduleData.filter(m => m.status === 'online').length;
    const healthPercentage = (onlineCount / moduleData.length) * 100;
    setSystemHealth(healthPercentage);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setModules(prev => prev.map(module => ({
        ...module,
        activeUsers: module.activeUsers + Math.floor(Math.random() * 3) - 1,
        pendingTasks: Math.max(0, module.pendingTasks + Math.floor(Math.random() * 3) - 1),
        lastSync: Math.random() > 0.7 ? new Date().toISOString() : module.lastSync
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-500">Online</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-yellow-500">Warning</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Integration Health
          </CardTitle>
          <CardDescription>
            Overall system connectivity and module performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">System Health</span>
                <span className="text-2xl font-bold text-green-600">{systemHealth.toFixed(1)}%</span>
              </div>
              <Progress value={systemHealth} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {modules.filter(m => m.status === 'online').length}
                </div>
                <div className="text-xs text-gray-500">Online</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {modules.filter(m => m.status === 'warning').length}
                </div>
                <div className="text-xs text-gray-500">Warnings</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules">Module Status</TabsTrigger>
          <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <Card key={module.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <module.icon className={`h-5 w-5 ${module.color}`} />
                      <CardTitle className="text-base">{module.name}</CardTitle>
                    </div>
                    {getStatusIcon(module.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(module.status)}
                    <span className="text-xs text-gray-500">
                      Last sync: {formatLastSync(module.lastSync)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{module.activeUsers}</div>
                      <div className="text-xs text-gray-500">Active Users</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{module.pendingTasks}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{module.completedToday}</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                  {showDetailedView && (
                    <Button size="sm" variant="outline" className="w-full">
                      View Details
                    </Button>
                  )}
                </CardContent>
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                  module.status === 'online' ? 'bg-green-500' :
                  module.status === 'warning' ? 'bg-yellow-500' :
                  module.status === 'offline' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dataflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Data Flow</CardTitle>
              <CardDescription>
                Data exchange between different modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataFlows.map((flow, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{flow.from}</Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <Badge variant="outline">{flow.to}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{flow.count} records</span>
                      <Badge variant={flow.status === 'active' ? 'default' : flow.status === 'pending' ? 'secondary' : 'destructive'}>
                        {flow.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Data Volume Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Patient Records</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Orders</span>
                    <span className="font-medium">456</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prescriptions</span>
                    <span className="font-medium">789</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing Records</span>
                    <span className="font-medium">567</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sync Success Rate</span>
                      <span className="text-sm font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Average Response Time</span>
                      <span className="text-sm font-medium">120ms</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Data Accuracy</span>
                      <span className="text-sm font-medium">99.2%</span>
                    </div>
                    <Progress value={99.2} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
