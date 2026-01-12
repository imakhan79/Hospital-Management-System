
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ClinicalReportsProps {
  timeframe: string;
}

// Placeholder data until real data is loaded
const diagnosisDistributionData = [
  { name: "Hypertension", count: 120 },
  { name: "Type 2 Diabetes", count: 85 },
  { name: "Asthma", count: 65 },
  { name: "Bronchitis", count: 45 },
  { name: "Influenza", count: 42 },
  { name: "Depression", count: 38 },
  { name: "Anxiety", count: 35 }
];

const treatmentOutcomesData = [
  { treatment: "Medication", improved: 75, unchanged: 15, worsened: 10 },
  { treatment: "Surgery", improved: 82, unchanged: 10, worsened: 8 },
  { treatment: "Physical Therapy", improved: 68, unchanged: 22, worsened: 10 },
  { treatment: "Counseling", improved: 65, unchanged: 25, worsened: 10 }
];

const readmissionRateData = [
  { month: "Jan", rate: 8.2 },
  { month: "Feb", rate: 7.9 },
  { month: "Mar", rate: 7.5 },
  { month: "Apr", rate: 7.8 },
  { month: "May", rate: 7.3 },
  { month: "Jun", rate: 7.0 },
  { month: "Jul", rate: 6.8 },
  { month: "Aug", rate: 6.5 },
  { month: "Sep", rate: 6.3 },
  { month: "Oct", rate: 6.0 },
  { month: "Nov", rate: 5.9 },
  { month: "Dec", rate: 5.7 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function ClinicalReports({ timeframe }: ClinicalReportsProps) {
  const [loading, setLoading] = useState(true);
  const [departmentStats, setDepartmentStats] = useState<{ department: string; count: number }[]>([]);
  const [diagnosisStats, setDiagnosisStats] = useState<{ diagnosis: string; count: number }[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Fetch department statistics from medical_records
        const { data: deptData, error: deptError } = await supabase
          .from('medical_records')
          .select('department')
          .not('department', 'is', null);
        
        if (deptError) throw deptError;
        
        // Count occurrences of each department
        const deptCounts: Record<string, number> = {};
        deptData.forEach(record => {
          const dept = record.department || 'Unknown';
          deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        });
        
        // Convert to array of objects and sort by count
        const deptStats = Object.entries(deptCounts)
          .map(([department, count]) => ({ department, count }))
          .sort((a, b) => b.count - a.count);
        
        setDepartmentStats(deptStats);
        
        // Fetch diagnosis statistics from medical_records
        const { data: diagData, error: diagError } = await supabase
          .from('medical_records')
          .select('diagnosis')
          .not('diagnosis', 'is', null);
        
        if (diagError) throw diagError;
        
        // Count occurrences of each diagnosis
        const diagCounts: Record<string, number> = {};
        diagData.forEach(record => {
          const diag = record.diagnosis || 'Unknown';
          diagCounts[diag] = (diagCounts[diag] || 0) + 1;
        });
        
        // Convert to array of objects and sort by count
        const diagStats = Object.entries(diagCounts)
          .map(([diagnosis, count]) => ({ diagnosis, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 7); // Get top 7 diagnoses
        
        setDiagnosisStats(diagStats);
      } catch (error) {
        console.error("Error loading clinical statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [timeframe]);
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Top Diagnoses</CardTitle>
          <CardDescription>Most common diagnoses ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diagnosisStats.length > 0 ? diagnosisStats : diagnosisDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={diagnosisStats.length > 0 ? "diagnosis" : "name"} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
          <CardDescription>Cases by department ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="department"
                  label={({ department, percent }) => `${department}: ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Treatment Outcomes</CardTitle>
          <CardDescription>Effectiveness by treatment type ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={treatmentOutcomesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="treatment" />
              <Tooltip />
              <Legend />
              <Bar dataKey="improved" stackId="a" fill="#82ca9d" name="Improved" />
              <Bar dataKey="unchanged" stackId="a" fill="#8884d8" name="Unchanged" />
              <Bar dataKey="worsened" stackId="a" fill="#ff8042" name="Worsened" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Readmission Rate</CardTitle>
          <CardDescription>30-day readmission trends ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={readmissionRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 10]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Readmission Rate']} />
              <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
