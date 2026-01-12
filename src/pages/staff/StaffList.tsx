import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import AddStaffForm from "@/components/staff/AddStaffForm";
import { Users, UserPlus, Search, Filter, Phone, Mail, Clock, MapPin, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateStaffData } from "@/services/systemService";

const StaffList = () => {
  const [staffData, setStaffData] = useState(generateStaffData());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [activeTab, setActiveTab] = useState("list");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.staff_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || staff.department === filterDepartment;
    const matchesRole = filterRole === "all" || staff.role === filterRole;
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Duty': return 'bg-green-500 text-white';
      case 'Off Duty': return 'bg-gray-500 text-white';
      case 'Break': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleAddStaff = () => {
    setShowAddForm(true);
  };

  const handleStaffAdded = (newStaff: any) => {
    setStaffData(prev => [newStaff, ...prev]);
    toast({
      title: "Staff Added",
      description: `${newStaff.name} has been successfully added to the system.`,
    });
  };

  const handleEditStaff = (staffId: string) => {
    toast({
      title: "Edit Staff",
      description: `Editing staff member: ${staffId}`,
    });
  };

  const handleUpdateShift = (staffId: string, newShift: string) => {
    setStaffData(prev => prev.map(staff => 
      staff.id === staffId ? { ...staff, shift: newShift } : staff
    ));
    toast({
      title: "Shift Updated",
      description: `Staff shift updated to ${newShift}`,
    });
  };

  const departments = ["all", ...Array.from(new Set(staffData.map(s => s.department)))];
  const roles = ["all", ...Array.from(new Set(staffData.map(s => s.role)))];

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage hospital staff, schedules, and assignments
            </p>
          </div>
          <Button onClick={handleAddStaff} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Staff
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffData.length}</div>
              <p className="text-xs text-muted-foreground">
                Active members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Duty</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {staffData.filter(s => s.status === 'On Duty').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently working
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length - 1}</div>
              <p className="text-xs text-muted-foreground">
                Active departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shifts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                24/7 coverage
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Staff Directory</TabsTrigger>
            <TabsTrigger value="schedule">Shift Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            {dept === "all" ? "All Departments" : dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>
                            {role === "all" ? "All Roles" : role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredStaff.map((staff) => (
                <Card key={staff.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{staff.name}</CardTitle>
                        <CardDescription>{staff.role} • {staff.department}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(staff.status)}>
                        {staff.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-1">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">ID:</span> {staff.staff_id}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">Shift:</span> {staff.shift}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Experience:</span> {staff.experience}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditStaff(staff.id)}
                        className="flex-1"
                      >
                        Edit Profile
                      </Button>
                      <Select onValueChange={(value) => handleUpdateShift(staff.id, value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Change Shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                          <SelectItem value="Night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shift Schedule Overview</CardTitle>
                <CardDescription>Current shift assignments and coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {['Morning', 'Evening', 'Night'].map(shift => (
                    <div key={shift} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3">{shift} Shift</h3>
                      <div className="space-y-2">
                        {staffData
                          .filter(s => s.shift === shift && s.status === 'On Duty')
                          .slice(0, 5)
                          .map(staff => (
                          <div key={staff.id} className="flex items-center justify-between text-sm">
                            <span>{staff.name}</span>
                            <Badge variant="outline">{staff.role}</Badge>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        {staffData.filter(s => s.shift === shift).length} staff assigned
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departments.slice(1).map(dept => {
                      const count = staffData.filter(s => s.department === dept).length;
                      const percentage = (count / staffData.length) * 100;
                      return (
                        <div key={dept} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{dept}</span>
                            <span>{count} staff</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${percentage}%`}}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roles.slice(1).map(role => {
                      const count = staffData.filter(s => s.role === role).length;
                      const percentage = (count / staffData.length) * 100;
                      return (
                        <div key={role} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{role}</span>
                            <span>{count} staff</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{width: `${percentage}%`}}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Staff Form Dialog */}
        <AddStaffForm
          open={showAddForm}
          onOpenChange={setShowAddForm}
          onStaffAdded={handleStaffAdded}
        />
      </div>
    </MainLayout>
  );
};

export default StaffList;
