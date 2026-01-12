import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Download, 
  Filter,
  CalendarDays,
  Activity,
  Clock,
  Video,
  Phone,
  MessageSquare
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";

interface ReportData {
  consultations: {
    daily: { date: string; video: number; audio: number; chat: number; total: number }[];
    monthly: { month: string; total: number; completed: number; cancelled: number }[];
    byDoctor: { doctor: string; total: number; rating: number; specialty: string }[];
    byType: { type: string; count: number; percentage: number }[];
  };
  revenue: {
    daily: { date: string; amount: number; consultations: number }[];
    monthly: { month: string; revenue: number; costs: number; profit: number }[];
  };
  patients: {
    demographics: { ageGroup: string; count: number; percentage: number }[];
    satisfaction: { rating: number; count: number; percentage: number }[];
    retention: { period: string; returning: number; new: number }[];
  };
  performance: {
    waitTimes: { timeRange: string; count: number }[];
    sessionDuration: { duration: string; count: number }[];
    connectionQuality: { quality: string; percentage: number }[];
  };
}

export const TelemedicineReports = () => {
  const [dateRange, setDateRange] = useState<string>('last_30_days');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [reportType, setReportType] = useState<string>('overview');

  // Mock data - in real app, this would come from API
  const reportData: ReportData = {
    consultations: {
      daily: [
        { date: '2024-01-01', video: 25, audio: 15, chat: 8, total: 48 },
        { date: '2024-01-02', video: 32, audio: 18, chat: 12, total: 62 },
        { date: '2024-01-03', video: 28, audio: 22, chat: 10, total: 60 },
        { date: '2024-01-04', video: 35, audio: 20, chat: 15, total: 70 },
        { date: '2024-01-05', video: 30, audio: 25, chat: 18, total: 73 },
        { date: '2024-01-06', video: 22, audio: 16, chat: 8, total: 46 },
        { date: '2024-01-07', video: 18, audio: 12, chat: 6, total: 36 }
      ],
      monthly: [
        { month: 'Oct', total: 1200, completed: 1050, cancelled: 150 },
        { month: 'Nov', total: 1350, completed: 1200, cancelled: 150 },
        { month: 'Dec', total: 1480, completed: 1320, cancelled: 160 },
        { month: 'Jan', total: 1520, completed: 1380, cancelled: 140 }
      ],
      byDoctor: [
        { doctor: 'Dr. Smith', total: 245, rating: 4.8, specialty: 'Cardiology' },
        { doctor: 'Dr. Davis', total: 220, rating: 4.6, specialty: 'Internal Medicine' },
        { doctor: 'Dr. Johnson', total: 180, rating: 4.7, specialty: 'Dermatology' },
        { doctor: 'Dr. Wilson', total: 165, rating: 4.9, specialty: 'Pediatrics' }
      ],
      byType: [
        { type: 'Video', count: 1890, percentage: 63 },
        { type: 'Audio', count: 765, percentage: 25 },
        { type: 'Chat', count: 360, percentage: 12 }
      ]
    },
    revenue: {
      daily: [
        { date: '2024-01-01', amount: 7200, consultations: 48 },
        { date: '2024-01-02', amount: 9300, consultations: 62 },
        { date: '2024-01-03', amount: 9000, consultations: 60 },
        { date: '2024-01-04', amount: 10500, consultations: 70 },
        { date: '2024-01-05', amount: 10950, consultations: 73 },
        { date: '2024-01-06', amount: 6900, consultations: 46 },
        { date: '2024-01-07', amount: 5400, consultations: 36 }
      ],
      monthly: [
        { month: 'Oct', revenue: 180000, costs: 120000, profit: 60000 },
        { month: 'Nov', revenue: 202500, costs: 135000, profit: 67500 },
        { month: 'Dec', revenue: 222000, costs: 148000, profit: 74000 },
        { month: 'Jan', revenue: 228000, costs: 152000, profit: 76000 }
      ]
    },
    patients: {
      demographics: [
        { ageGroup: '18-25', count: 180, percentage: 12 },
        { ageGroup: '26-35', count: 450, percentage: 30 },
        { ageGroup: '36-50', count: 525, percentage: 35 },
        { ageGroup: '51-65', count: 270, percentage: 18 },
        { ageGroup: '65+', count: 75, percentage: 5 }
      ],
      satisfaction: [
        { rating: 5, count: 720, percentage: 48 },
        { rating: 4, count: 600, percentage: 40 },
        { rating: 3, count: 135, percentage: 9 },
        { rating: 2, count: 30, percentage: 2 },
        { rating: 1, count: 15, percentage: 1 }
      ],
      retention: [
        { period: 'Jan', returning: 85, new: 15 },
        { period: 'Feb', returning: 88, new: 12 },
        { period: 'Mar', returning: 82, new: 18 },
        { period: 'Apr', returning: 90, new: 10 }
      ]
    },
    performance: {
      waitTimes: [
        { timeRange: '0-2 min', count: 450 },
        { timeRange: '2-5 min', count: 380 },
        { timeRange: '5-10 min', count: 220 },
        { timeRange: '10+ min', count: 85 }
      ],
      sessionDuration: [
        { duration: '0-15 min', count: 120 },
        { duration: '15-30 min', count: 650 },
        { duration: '30-45 min', count: 420 },
        { duration: '45+ min', count: 180 }
      ],
      connectionQuality: [
        { quality: 'Excellent', percentage: 75 },
        { quality: 'Good', percentage: 20 },
        { quality: 'Poor', percentage: 5 }
      ]
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const totalConsultations = reportData.consultations.daily.reduce((sum, day) => sum + day.total, 0);
  const totalRevenue = reportData.revenue.daily.reduce((sum, day) => sum + day.amount, 0);
  const averageRating = reportData.patients.satisfaction.reduce((sum, item) => sum + (item.rating * item.count), 0) / 
                       reportData.patients.satisfaction.reduce((sum, item) => sum + item.count, 0);

  const handleDownload = (reportType: string) => {
    console.log(`Downloading ${reportType} report...`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            Telemedicine Reports & Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalConsultations}</div>
            <p className="text-xs text-muted-foreground">Total Consultations</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+12%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+8%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
            <div className="flex items-center justify-center mt-2">
              <span className="text-xs text-yellow-500">★★★★★</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">92%</div>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+3%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports */}
      <Tabs defaultValue="consultations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="consultations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Consultations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Daily Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.consultations.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="video" stackId="a" fill="#0088FE" name="Video" />
                    <Bar dataKey="audio" stackId="a" fill="#00C49F" name="Audio" />
                    <Bar dataKey="chat" stackId="a" fill="#FFBB28" name="Chat" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Consultation Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Consultation Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.consultations.byType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.consultations.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Doctor Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.consultations.byDoctor.map((doctor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{doctor.doctor}</h4>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                    <div className="text-center px-4">
                      <div className="font-semibold">{doctor.total}</div>
                      <p className="text-xs text-muted-foreground">Consultations</p>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">{doctor.rating}⭐</div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Daily Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.revenue.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Profit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Profit Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.revenue.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#00C49F" name="Revenue" />
                    <Bar dataKey="costs" fill="#FF8042" name="Costs" />
                    <Bar dataKey="profit" fill="#0088FE" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.patients.demographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ ageGroup, percentage }) => `${ageGroup} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.patients.demographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Patient Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Patient Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.patients.satisfaction.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-16">
                        <span className="font-medium">{item.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground w-16 text-right">
                        {item.count} ({item.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wait Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Patient Wait Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.performance.waitTimes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeRange" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Session Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Session Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.performance.sessionDuration}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="duration" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Connection Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Connection Quality Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {reportData.performance.connectionQuality.map((item, index) => (
                  <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold mb-2" style={{ color: COLORS[index] }}>
                      {item.percentage}%
                    </div>
                    <p className="text-sm font-medium">{item.quality}</p>
                    <p className="text-xs text-muted-foreground">Connection Quality</p>
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