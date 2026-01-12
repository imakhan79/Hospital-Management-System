
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

interface OperationalReportsProps {
  timeframe: string;
}

const patientAdmissionData = [
  { day: "Mon", count: 28 },
  { day: "Tue", count: 35 },
  { day: "Wed", count: 42 },
  { day: "Thu", count: 31 },
  { day: "Fri", count: 39 },
  { day: "Sat", count: 22 },
  { day: "Sun", count: 18 }
];

const departmentUtilizationData = [
  { name: "Emergency", value: 32 },
  { name: "Outpatient", value: 45 },
  { name: "Inpatient", value: 18 },
  { name: "Surgery", value: 15 },
  { name: "ICU", value: 8 }
];

const staffWorkloadData = [
  { name: "Physicians", available: 42, assigned: 38 },
  { name: "Nurses", available: 85, assigned: 78 },
  { name: "Lab Techs", available: 28, assigned: 24 },
  { name: "Administrators", available: 35, assigned: 32 },
  { name: "Support Staff", available: 48, assigned: 42 }
];

const waitTimeData = [
  { name: "Emergency", minutes: 25 },
  { name: "Outpatient", minutes: 42 },
  { name: "Lab Testing", minutes: 35 },
  { name: "Pharmacy", minutes: 18 },
  { name: "Radiology", minutes: 30 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function OperationalReports({ timeframe }: OperationalReportsProps) {
  // In a real app, we would fetch different data based on the timeframe
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Patient Admissions</CardTitle>
          <CardDescription>Daily patient admission count ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patientAdmissionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Department Utilization</CardTitle>
          <CardDescription>Distribution of facility usage ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentUtilizationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {departmentUtilizationData.map((entry, index) => (
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
          <CardTitle>Staff Workload</CardTitle>
          <CardDescription>Staff allocation and availability ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staffWorkloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="available" fill="#8884d8" name="Available" />
              <Bar dataKey="assigned" fill="#82ca9d" name="Assigned" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Average Wait Times</CardTitle>
          <CardDescription>Patient wait times by department ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waitTimeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value) => [`${value} minutes`, 'Wait Time']} />
              <Bar dataKey="minutes" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
