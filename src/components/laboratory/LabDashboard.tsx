
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FlaskConical, ClipboardCheck, Clock, AlertTriangle } from "lucide-react";

const testsByCategoryData = [
  { name: "Blood Tests", count: 156 },
  { name: "Urine Analysis", count: 98 },
  { name: "Imaging", count: 72 },
  { name: "Pathology", count: 45 },
  { name: "Microbiology", count: 38 },
  { name: "Cardiac", count: 28 }
];

const testsByStatusData = [
  { name: "Completed", value: 320 },
  { name: "In Progress", value: 65 },
  { name: "Pending", value: 123 },
  { name: "Cancelled", value: 12 }
];

const testsByDayData = [
  { day: "Mon", count: 32 },
  { day: "Tue", count: 42 },
  { day: "Wed", count: 51 },
  { day: "Thu", count: 39 },
  { day: "Fri", count: 47 },
  { day: "Sat", count: 28 },
  { day: "Sun", count: 19 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function LabDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          <FlaskConical className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">520</div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">320</div>
          <p className="text-xs text-muted-foreground">61.5% completion rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500">65</div>
          <p className="text-xs text-muted-foreground">12.5% of total tests</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">123</div>
          <p className="text-xs text-muted-foreground">23.7% awaiting processing</p>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Tests by Category</CardTitle>
          <CardDescription>Distribution of tests by type</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={testsByCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Test Status</CardTitle>
          <CardDescription>Overall test status distribution</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={testsByStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {testsByStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Daily Test Volume</CardTitle>
          <CardDescription>Tests processed by day of week</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={testsByDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
