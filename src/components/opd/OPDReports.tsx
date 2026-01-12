
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, Clock, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getOPDMetrics,
  OPDAppointment,
  Invoice,
  LabRequest,
  DispenseRecord,
  departments
} from "@/services/opdService";

export const OPDReports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    appointments: OPDAppointment[],
    invoices: Invoice[],
    labRequests: LabRequest[],
    pharmacyDispenses: DispenseRecord[]
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const metrics = await getOPDMetrics();
      setData(metrics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center">Loading Analytics...</div>;
  }

  // --- Calculations ---

  // 1. Revenue
  const totalRevenue = data.invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const pendingRevenue = data.invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  // 2. Department Stats
  const departmentStats = departments.map(dept => {
    const deptAppointments = data.appointments.filter(a => a.department === dept.name);
    // Rough calc of revenue per department (Consultation fees only)
    const deptRevenue = deptAppointments.filter(a => a.status === 'completed').length * dept.consultationFee;

    return {
      name: dept.name,
      total: deptAppointments.length,
      completed: deptAppointments.filter(a => a.status === 'completed').length,
      revenue: deptRevenue
    };
  });

  // 3. Appointments by Day (Last 7 Days)
  const today = new Date();
  const thisWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailyStats = thisWeek.map(date => {
    const dayApps = data.appointments.filter(a => a.appointmentDate === date);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      appointments: dayApps.length,
      completed: dayApps.filter(a => a.status === 'completed').length,
      cancelled: dayApps.filter(a => a.status === 'cancelled').length
    };
  });

  // 4. Revenue by Source
  const revenueBySource = [
    { name: 'Registration', value: data.invoices.filter(i => i.billType === 'Registration').reduce((s, i) => s + i.amount, 0), color: '#8884d8' },
    { name: 'Consultation', value: data.invoices.filter(i => i.billType === 'Consultation').reduce((s, i) => s + i.amount, 0), color: '#82ca9d' },
    { name: 'Pharmacy', value: data.invoices.filter(i => i.billType === 'Pharmacy').reduce((s, i) => s + i.amount, 0), color: '#ffc658' },
    { name: 'Lab', value: data.invoices.filter(i => i.billType === 'Lab').reduce((s, i) => s + i.amount, 0), color: '#ff7300' },
  ].filter(i => i.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">OPD Reports & Analytics</h2>
          <p className="text-muted-foreground">Real-time insights into hospital performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.appointments.length}</div>
            <p className="text-xs text-muted-foreground">All time records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.labRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {data.labRequests.filter(r => r.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pharmacy Dispensed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pharmacyDispenses.length}</div>
            <p className="text-xs text-muted-foreground">Prescriptions filled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              + ₹{pendingRevenue.toLocaleString()} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Appointments Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Appointments (Last 7 Days)</CardTitle>
            <CardDescription>Patient volume trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Mix */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>Income by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Detailed breakdown by specialty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Appointments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Revenue (Est)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {departmentStats.map((dept) => (
                  <tr key={dept.name}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dept.total}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{dept.completed}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">₹{dept.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
