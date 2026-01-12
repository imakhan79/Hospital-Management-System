
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

interface FinancialReportsProps {
  timeframe: string;
}

const revenueExpenseData = [
  { month: "Jan", revenue: 320000, expenses: 280000 },
  { month: "Feb", revenue: 340000, expenses: 290000 },
  { month: "Mar", revenue: 365000, expenses: 295000 },
  { month: "Apr", revenue: 352000, expenses: 285000 },
  { month: "May", revenue: 370000, expenses: 300000 },
  { month: "Jun", revenue: 385000, expenses: 310000 },
  { month: "Jul", revenue: 400000, expenses: 320000 },
  { month: "Aug", revenue: 395000, expenses: 315000 },
  { month: "Sep", revenue: 380000, expenses: 305000 },
  { month: "Oct", revenue: 390000, expenses: 310000 },
  { month: "Nov", revenue: 410000, expenses: 325000 },
  { month: "Dec", revenue: 430000, expenses: 340000 }
];

const revenueSourceData = [
  { name: "Insurance", value: 65 },
  { name: "Out-of-pocket", value: 18 },
  { name: "Government", value: 12 },
  { name: "Grants", value: 5 }
];

const expenseCategoryData = [
  { name: "Staff Salaries", value: 55 },
  { name: "Supplies", value: 18 },
  { name: "Equipment", value: 12 },
  { name: "Facilities", value: 10 },
  { name: "Administrative", value: 5 }
];

const billingEfficiencyData = [
  { month: "Jan", percent: 82 },
  { month: "Feb", percent: 83 },
  { month: "Mar", percent: 85 },
  { month: "Apr", percent: 84 },
  { month: "May", percent: 87 },
  { month: "Jun", percent: 88 },
  { month: "Jul", percent: 89 },
  { month: "Aug", percent: 90 },
  { month: "Sep", percent: 91 },
  { month: "Oct", percent: 90 },
  { month: "Nov", percent: 92 },
  { month: "Dec", percent: 93 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function FinancialReports({ timeframe }: FinancialReportsProps) {
  // In a real app, we would fetch different data based on the timeframe
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
          <CardDescription>Monthly financial performance ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`PKR ${value.toLocaleString()}`, value === revenueExpenseData[0].revenue ? 'Revenue' : 'Expenses']} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Sources</CardTitle>
          <CardDescription>Distribution of revenue streams ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {revenueSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Breakdown of operational costs ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Efficiency</CardTitle>
          <CardDescription>Claims processing efficiency ({timeframe})</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={billingEfficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[75, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Efficiency']} />
              <Legend />
              <Line type="monotone" dataKey="percent" stroke="#8884d8" activeDot={{ r: 8 }} name="Efficiency" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
