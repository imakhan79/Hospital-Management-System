
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Activity, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export const ClinicalStats = () => {
  const monthlyData = [
    { month: "Jan", patients: 245, procedures: 89, satisfaction: 4.2 },
    { month: "Feb", patients: 289, procedures: 102, satisfaction: 4.4 },
    { month: "Mar", patients: 312, procedures: 118, satisfaction: 4.3 },
    { month: "Apr", patients: 298, procedures: 95, satisfaction: 4.5 },
    { month: "May", patients: 334, procedures: 134, satisfaction: 4.6 },
    { month: "Jun", patients: 356, procedures: 142, satisfaction: 4.7 }
  ];

  const departmentData = [
    { name: "Cardiology", value: 28, color: "#8884d8" },
    { name: "Neurology", value: 22, color: "#82ca9d" },
    { name: "Orthopedics", value: 18, color: "#ffc658" },
    { name: "Pediatrics", value: 16, color: "#ff7300" },
    { name: "Surgery", value: 16, color: "#00ff88" }
  ];

  const qualityMetrics = [
    { metric: "Patient Satisfaction", score: 94, target: 90 },
    { metric: "Treatment Success Rate", score: 97, target: 95 },
    { metric: "Readmission Rate", score: 8, target: 10, inverse: true },
    { metric: "Average Stay Duration", score: 4.2, target: 5.0, unit: "days", inverse: true }
  ];

  const recentAlerts = [
    { id: 1, type: "critical", message: "Patient #2847 requires immediate attention", time: "5 min ago" },
    { id: 2, type: "warning", message: "High patient volume in Emergency", time: "12 min ago" },
    { id: 3, type: "info", message: "New clinical protocol updated", time: "1 hour ago" }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertBadge = (type) => {
    switch (type) {
      case "critical": return "destructive";
      case "warning": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procedures Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from yesterday
            </p>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23 min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3 min</span> from target
            </p>
            <Progress value={42} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.5%</span> improvement
            </p>
            <Progress value={97} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Patient Volume</CardTitle>
                <CardDescription>Patient visits and procedures over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="patients" fill="#8884d8" name="Patients" />
                    <Bar dataKey="procedures" fill="#82ca9d" name="Procedures" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Satisfaction Trend</CardTitle>
                <CardDescription>Average satisfaction scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[4.0, 5.0]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Satisfaction"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {qualityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">
                      {metric.score}{metric.unit || '%'}
                    </span>
                    <Badge 
                      variant={
                        metric.inverse 
                          ? (metric.score <= metric.target ? "default" : "destructive")
                          : (metric.score >= metric.target ? "default" : "destructive")
                      }
                    >
                      Target: {metric.target}{metric.unit || '%'}
                    </Badge>
                  </div>
                  <Progress 
                    value={
                      metric.inverse 
                        ? Math.max(0, 100 - (metric.score / metric.target * 100))
                        : Math.min(100, (metric.score / metric.target * 100))
                    } 
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {metric.inverse 
                      ? (metric.score <= metric.target ? "Within target range" : "Above target")
                      : (metric.score >= metric.target ? "Meeting target" : "Below target")
                    }
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Distribution</CardTitle>
                <CardDescription>Patient distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Performance</CardTitle>
                <CardDescription>Key metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dept.value}% of patients
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">4.{5 + index}</div>
                        <div className="text-xs text-muted-foreground">Avg Rating</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Clinical Alerts</CardTitle>
              <CardDescription>Important notifications and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <Badge variant={getAlertBadge(alert.type)} className="text-xs">
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
