
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { CalendarIcon, Download, FileText, TrendingUp, Users, DollarSign, Activity, Filter, Search, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";

const ReportsModule = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [selectedReport, setSelectedReport] = useState("financial");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const { toast } = useToast();

  // Mock data for charts
  const monthlyRevenue = [
    { month: "Jan", revenue: 125000, expenses: 85000, profit: 40000 },
    { month: "Feb", revenue: 134000, expenses: 88000, profit: 46000 },
    { month: "Mar", revenue: 142000, expenses: 92000, profit: 50000 },
    { month: "Apr", revenue: 138000, expenses: 89000, profit: 49000 },
    { month: "May", revenue: 156000, expenses: 95000, profit: 61000 },
    { month: "Jun", revenue: 164000, expenses: 98000, profit: 66000 }
  ];

  const departmentRevenue = [
    { name: "Surgery", value: 45, amount: 185000, color: "#8884d8" },
    { name: "Emergency", value: 25, amount: 105000, color: "#82ca9d" },
    { name: "Cardiology", value: 15, amount: 62000, color: "#ffc658" },
    { name: "Neurology", value: 10, amount: 42000, color: "#ff7300" },
    { name: "Others", value: 5, amount: 21000, color: "#00ff88" }
  ];

  const patientStats = [
    { month: "Jan", admissions: 245, discharges: 238, occupancy: 85 },
    { month: "Feb", admissions: 267, discharges: 259, occupancy: 88 },
    { month: "Mar", admissions: 289, discharges: 275, occupancy: 91 },
    { month: "Apr", admissions: 276, discharges: 284, occupancy: 89 },
    { month: "May", admissions: 298, discharges: 292, occupancy: 93 },
    { month: "Jun", admissions: 312, discharges: 305, occupancy: 95 }
  ];

  const operationalMetrics = [
    { metric: "Bed Occupancy Rate", current: 93, target: 85, trend: "+8%" },
    { metric: "Average Length of Stay", current: 4.2, target: 5.0, trend: "-0.3 days" },
    { metric: "Patient Satisfaction", current: 94, target: 90, trend: "+4%" },
    { metric: "Staff Utilization", current: 87, target: 80, trend: "+7%" }
  ];

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `${selectedReport} report has been generated successfully.`,
    });
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Initiated",
      description: `Report is being exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Comprehensive reporting and data analytics dashboard
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => handleExportReport('pdf')}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$964K</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Volume</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,847</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-600">+8%</span> above target
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">40.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="clinical">Clinical Report</SelectItem>
                    <SelectItem value="operational">Operational Report</SelectItem>
                    <SelectItem value="patient">Patient Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Revenue Trend</CardTitle>
                  <CardDescription>Revenue, expenses, and profit over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                      <Bar dataKey="profit" fill="#ffc658" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Department Revenue Distribution</CardTitle>
                  <CardDescription>Revenue breakdown by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentRevenue}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentRevenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [
                        `$${props.payload.amount.toLocaleString()}`, name
                      ]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Volume Trends</CardTitle>
                <CardDescription>Admissions, discharges, and occupancy rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="admissions" stroke="#8884d8" name="Admissions" />
                    <Line type="monotone" dataKey="discharges" stroke="#82ca9d" name="Discharges" />
                    <Line type="monotone" dataKey="occupancy" stroke="#ffc658" name="Occupancy %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Summary</CardTitle>
                  <CardDescription>Financial performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-bold">$964,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Expenses</span>
                      <span className="font-bold">$578,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Profit</span>
                      <span className="font-bold text-green-600">$386,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit Margin</span>
                      <span className="font-bold">40.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Revenue Sources</CardTitle>
                  <CardDescription>Highest earning departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentRevenue.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{dept.name}</div>
                          <div className="text-sm text-muted-foreground">{dept.value}% of total</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${dept.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operational" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {operationalMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">
                        {metric.current}{metric.metric.includes('Rate') || metric.metric.includes('Satisfaction') ? '%' : 
                         metric.metric.includes('Stay') ? ' days' : ''}
                      </span>
                      <Badge variant={
                        (metric.metric.includes('Stay') ? metric.current < metric.target : metric.current >= metric.target)
                          ? "default" : "destructive"
                      }>
                        Target: {metric.target}{metric.metric.includes('Rate') || metric.metric.includes('Satisfaction') ? '%' : 
                                metric.metric.includes('Stay') ? ' days' : ''}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Trend:</span>
                      <span className="text-sm font-medium">{metric.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clinical" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Patient Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Successful Treatments</span>
                      <span className="font-bold">97.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Readmission Rate</span>
                      <span className="font-bold">5.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Patient Satisfaction</span>
                      <span className="font-bold">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Infection Rate</span>
                      <span className="font-bold">1.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medication Errors</span>
                      <span className="font-bold">0.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="font-bold">3.2 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Staff Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Staff Utilization</span>
                      <span className="font-bold">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Training Compliance</span>
                      <span className="font-bold">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Overtime Hours</span>
                      <span className="font-bold">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Export Options</CardTitle>
            <CardDescription>Export reports in different formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('excel')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('print')}>
                <FileText className="mr-2 h-4 w-4" />
                Print Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReportsModule;
