
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Stethoscope,
  FlaskConical,
  Pill,
  Receipt,
  BedDouble,
  AlertTriangle,
  TrendingUp,
  Clock,
  Heart,
  Activity,
  UserPlus,
  CalendarCheck,
  FileText,
  DollarSign,
  Phone,
  Bell,
  Video
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { user } = useAuth();
  const [realTimeData, setRealTimeData] = useState({
    totalPatients: 2847,
    todayAppointments: 156,
    activeBeds: 89,
    pendingTests: 23,
    criticalAlerts: 3,
    revenue: 245000,
    staffOnDuty: 127,
    emergencyCases: 8
  });

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        todayAppointments: prev.todayAppointments + Math.floor(Math.random() * 3),
        pendingTests: Math.max(0, prev.pendingTests + Math.floor(Math.random() * 5) - 2),
        criticalAlerts: Math.max(0, prev.criticalAlerts + Math.floor(Math.random() * 2) - 1),
        emergencyCases: Math.max(0, prev.emergencyCases + Math.floor(Math.random() * 2) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const patientFlowData = [
    { time: "08:00", registered: 12, treated: 8, waiting: 4 },
    { time: "10:00", registered: 28, treated: 22, waiting: 6 },
    { time: "12:00", registered: 45, treated: 38, waiting: 7 },
    { time: "14:00", registered: 67, treated: 59, waiting: 8 },
    { time: "16:00", registered: 89, treated: 76, waiting: 13 },
    { time: "18:00", registered: 102, treated: 94, waiting: 8 }
  ];

  const departmentStats = [
    { name: "Cardiology", patients: 45, revenue: 125000, satisfaction: 4.8 },
    { name: "Neurology", patients: 32, revenue: 89000, satisfaction: 4.6 },
    { name: "Pediatrics", patients: 78, revenue: 67000, satisfaction: 4.9 },
    { name: "Orthopedics", patients: 56, revenue: 103000, satisfaction: 4.7 },
    { name: "Emergency", patients: 123, revenue: 78000, satisfaction: 4.4 }
  ];

  const revenueData = [
    { month: "Jan", opd: 180000, ipd: 220000, pharmacy: 45000, lab: 32000 },
    { month: "Feb", opd: 195000, ipd: 235000, pharmacy: 48000, lab: 35000 },
    { month: "Mar", opd: 210000, ipd: 245000, pharmacy: 52000, lab: 38000 },
    { month: "Apr", opd: 225000, ipd: 260000, pharmacy: 55000, lab: 42000 },
    { month: "May", opd: 240000, ipd: 275000, pharmacy: 58000, lab: 45000 },
    { month: "Jun", opd: 255000, ipd: 290000, pharmacy: 62000, lab: 48000 }
  ];

  const criticalAlerts = [
    { id: 1, type: "emergency", message: "Patient #2045 - Cardiac Emergency in Room 305", time: "2 min ago", severity: "critical" },
    { id: 2, type: "lab", message: "Critical Lab Results for Patient #1823", time: "5 min ago", severity: "high" },
    { id: 3, type: "inventory", message: "Low Stock Alert: O2 Cylinders (5 remaining)", time: "15 min ago", severity: "medium" }
  ];

  const quickActions = [
    { icon: Users, label: "Find a Doctor", color: "bg-purple-500", action: "/find-doctor" },
    { icon: UserPlus, label: "Register Patient", color: "bg-blue-500", action: "/patients/register" },
    { icon: AlertTriangle, label: "Emergency", color: "bg-red-500", action: "/emergency" },
    { icon: CalendarCheck, label: "Book Appointment", color: "bg-green-500", action: "/opd" },
    { icon: Video, label: "Telemedicine", color: "bg-indigo-500", action: "/telemedicine" },
    { icon: FileText, label: "View Records", color: "bg-purple-500", action: "/records" },
    { icon: FlaskConical, label: "Lab Results", color: "bg-orange-500", action: "/laboratory" },
    { icon: Pill, label: "Pharmacy", color: "bg-teal-500", action: "/pharmacy" },
    { icon: Receipt, label: "Billing", color: "bg-pink-500", action: "/billing" }
  ];

  return (
    <MainLayout>
      <div className="space-y-8 p-6 bg-gradient-to-br from-background via-background to-muted/30 min-h-screen">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome back, {user?.name || "Admin"}
            </h1>
            <p className="text-muted-foreground text-lg font-inter">
              Here's what's happening at XI HIMS today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-green-500" />
              System Online
            </Badge>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-1" />
              {realTimeData.criticalAlerts} Alerts
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Critical Alerts ({criticalAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-red-500">
                  <div>
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'high' ? 'default' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="stylish-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-poppins font-semibold gradient-text">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground font-inter">Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex-col gap-3 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card to-muted/50 hover:shadow-lg hover:scale-105 transition-all duration-300 font-inter"
                  onClick={() => window.location.href = action.action}
                >
                  <div className={`p-3 rounded-full ${action.color} text-white shadow-lg`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="metric-card border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold font-poppins text-muted-foreground">Total Patients</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 font-roboto">{realTimeData.totalPatients.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground font-inter mt-2">
                <span className="text-green-600 font-semibold">+12%</span> from last month
              </p>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full -mr-10 -mb-10"></div>
            </CardContent>
          </Card>

          <Card className="metric-card border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold font-poppins text-muted-foreground">Today's Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 font-roboto">{realTimeData.todayAppointments}</div>
              <p className="text-sm text-muted-foreground font-inter mt-2">
                <span className="text-green-600 font-semibold">+5</span> since last hour
              </p>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full -mr-10 -mb-10"></div>
            </CardContent>
          </Card>

          <Card className="metric-card border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold font-poppins text-muted-foreground">Occupied Beds</CardTitle>
              <BedDouble className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 font-roboto">{realTimeData.activeBeds}/120</div>
              <Progress value={(realTimeData.activeBeds / 120) * 100} className="mt-3" />
              <p className="text-sm text-muted-foreground font-inter mt-2">
                {Math.round((realTimeData.activeBeds / 120) * 100)}% Occupancy
              </p>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full -mr-10 -mb-10"></div>
            </CardContent>
          </Card>

          <Card className="metric-card border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold font-poppins text-muted-foreground">Monthly Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 font-roboto">₹{(realTimeData.revenue / 1000).toFixed(0)}K</div>
              <p className="text-sm text-muted-foreground font-inter mt-2">
                <span className="text-green-600 font-semibold">+18%</span> from last month
              </p>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full -mr-10 -mb-10"></div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patient-flow">Patient Flow</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time System Status</CardTitle>
                  <CardDescription>Current system performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <div className="text-sm text-gray-600">System Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">12min</div>
                      <div className="text-sm text-gray-600">Avg Wait Time</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Phone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{realTimeData.staffOnDuty}</div>
                      <div className="text-sm text-gray-600">Staff On Duty</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{realTimeData.emergencyCases}</div>
                      <div className="text-sm text-gray-600">Emergency Cases</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Today's department statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentStats.slice(0, 4).map((dept) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{dept.name}</div>
                          <div className="text-sm text-gray-500">{dept.patients} patients</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{(dept.revenue / 1000).toFixed(0)}K</div>
                          <div className="text-sm text-yellow-600">★ {dept.satisfaction}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patient-flow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Flow Analysis</CardTitle>
                <CardDescription>Real-time patient registration and treatment flow</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={patientFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="registered" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="treated" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="waiting" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {departmentStats.map((dept) => (
                <Card key={dept.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {dept.name}
                      <Badge variant="secondary">{dept.patients} patients</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Revenue</span>
                        <span className="font-medium">₹{(dept.revenue / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfaction</span>
                        <span className="font-medium text-yellow-600">★ {dept.satisfaction}</span>
                      </div>
                      <Progress value={(dept.patients / 150) * 100} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="opd" stackId="a" fill="#8884d8" />
                    <Bar dataKey="ipd" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="pharmacy" stackId="a" fill="#ffc658" />
                    <Bar dataKey="lab" stackId="a" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
