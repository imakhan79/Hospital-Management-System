
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { Receipt, CreditCard, DollarSign, AlertCircle } from "lucide-react";

const revenueByTypeData = [
  { name: "Consultations", value: 45000 },
  { name: "Laboratory", value: 32000 },
  { name: "Procedures", value: 28000 },
  { name: "Pharmacy", value: 18000 },
  { name: "Other", value: 7000 }
];

const paymentMethodData = [
  { name: "Insurance", value: 65 },
  { name: "Credit Card", value: 18 },
  { name: "Cash", value: 12 },
  { name: "Other", value: 5 }
];

const monthlyRevenueData = [
  { month: "Jan", revenue: 38000 },
  { month: "Feb", revenue: 42000 },
  { month: "Mar", revenue: 55000 },
  { month: "Apr", revenue: 47000 },
  { month: "May", revenue: 52000 },
  { month: "Jun", revenue: 58000 },
  { month: "Jul", revenue: 65000 },
  { month: "Aug", revenue: 61000 },
  { month: "Sep", revenue: 59000 },
  { month: "Oct", revenue: 63000 },
  { month: "Nov", revenue: 67000 },
  { month: "Dec", revenue: 72000 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function BillingDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$130,000</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500">$32,500</div>
          <p className="text-xs text-muted-foreground">25% of total revenue</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Invoices</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 6h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">423</div>
          <p className="text-xs text-muted-foreground">85 pending approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">$15,800</div>
          <p className="text-xs text-muted-foreground">12% of total revenue</p>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue trends over the past year</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Revenue by Type</CardTitle>
          <CardDescription>Distribution of revenue sources</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {revenueByTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>How patients are paying</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
