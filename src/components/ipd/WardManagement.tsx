
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bed, Users, MapPin, AlertTriangle, Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WardManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWard, setFilterWard] = useState("all");
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const { toast } = useToast();

  const [wards, setWards] = useState([
    {
      id: 1,
      name: "General Ward A",
      location: "Floor 2, Wing A",
      totalBeds: 50,
      occupiedBeds: 45,
      availableBeds: 5,
      maintenanceBeds: 0,
      occupancyRate: 90,
      type: "General"
    },
    {
      id: 2,
      name: "ICU",
      location: "Floor 3, Wing B",
      totalBeds: 20,
      occupiedBeds: 18,
      availableBeds: 2,
      maintenanceBeds: 0,
      occupancyRate: 90,
      type: "ICU"
    },
    {
      id: 3,
      name: "Pediatric Ward",
      location: "Floor 1, Wing C",
      totalBeds: 30,
      occupiedBeds: 22,
      availableBeds: 8,
      maintenanceBeds: 0,
      occupancyRate: 73,
      type: "Pediatric"
    },
    {
      id: 4,
      name: "Maternity Ward",
      location: "Floor 2, Wing D",
      totalBeds: 25,
      occupiedBeds: 15,
      availableBeds: 10,
      maintenanceBeds: 0,
      occupancyRate: 60,
      type: "Maternity"
    }
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "admission",
      title: "New Admission - Room 205",
      description: "Patient: John Smith, Age: 45",
      time: "2 hours ago",
      wardId: 1
    },
    {
      id: 2,
      type: "transfer",
      title: "Room Transfer - 301 to 205",
      description: "Patient: Mary Johnson",
      time: "4 hours ago",
      wardId: 1
    },
    {
      id: 3,
      type: "maintenance",
      title: "Bed Maintenance - Room 102",
      description: "Equipment repair in progress",
      time: "6 hours ago",
      wardId: 2
    }
  ]);

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    wardId: "",
    bedNumber: "",
    admissionType: ""
  });

  const handleBedAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedWard = wards.find(w => w.id === parseInt(formData.wardId));
    
    if (selectedWard && selectedWard.availableBeds > 0) {
      setWards(wards.map(ward => 
        ward.id === parseInt(formData.wardId) 
          ? {
              ...ward,
              occupiedBeds: ward.occupiedBeds + 1,
              availableBeds: ward.availableBeds - 1,
              occupancyRate: Math.round(((ward.occupiedBeds + 1) / ward.totalBeds) * 100)
            }
          : ward
      ));

      const newActivity = {
        id: activities.length + 1,
        type: "admission",
        title: `New Allocation - Room ${formData.bedNumber}`,
        description: `Patient: ${formData.patientName}`,
        time: "Just now",
        wardId: parseInt(formData.wardId)
      };

      setActivities([newActivity, ...activities]);
      setFormData({
        patientName: "",
        patientId: "",
        wardId: "",
        bedNumber: "",
        admissionType: ""
      });
      setIsAllocateOpen(false);

      toast({
        title: "Bed Allocated Successfully",
        description: `Bed ${formData.bedNumber} assigned to ${formData.patientName}`,
      });
    }
  };

  const handleBedMaintenance = (wardId: number) => {
    setWards(wards.map(ward => 
      ward.id === wardId 
        ? {
            ...ward,
            availableBeds: ward.availableBeds - 1,
            maintenanceBeds: ward.maintenanceBeds + 1
          }
        : ward
    ));

    toast({
      title: "Bed Marked for Maintenance",
      description: "Bed has been temporarily removed from availability",
    });
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return "destructive";
    if (rate >= 75) return "secondary";
    return "outline";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "admission":
        return <Bed className="h-4 w-4 text-green-500" />;
      case "transfer":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredWards = wards.filter(ward => {
    const matchesSearch = ward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ward.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterWard === "all" || ward.type === filterWard;
    return matchesSearch && matchesFilter;
  });

  const totalStats = wards.reduce((acc, ward) => ({
    totalBeds: acc.totalBeds + ward.totalBeds,
    occupiedBeds: acc.occupiedBeds + ward.occupiedBeds,
    availableBeds: acc.availableBeds + ward.availableBeds,
    maintenanceBeds: acc.maintenanceBeds + ward.maintenanceBeds
  }), { totalBeds: 0, occupiedBeds: 0, availableBeds: 0, maintenanceBeds: 0 });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Ward Management</h2>
          <p className="text-sm text-muted-foreground">
            Real-time bed allocation and ward monitoring
          </p>
        </div>
        <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Allocate Bed
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Bed Allocation</DialogTitle>
              <DialogDescription>
                Assign a bed to a patient
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBedAllocation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    value={formData.patientId}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wardId">Ward</Label>
                <Select value={formData.wardId} onValueChange={(value) => setFormData({...formData, wardId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.filter(w => w.availableBeds > 0).map((ward) => (
                      <SelectItem key={ward.id} value={ward.id.toString()}>
                        {ward.name} ({ward.availableBeds} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedNumber">Bed Number</Label>
                  <Input
                    id="bedNumber"
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({...formData, bedNumber: e.target.value})}
                    placeholder="e.g., 205"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionType">Admission Type</Label>
                  <Select value={formData.admissionType} onValueChange={(value) => setFormData({...formData, admissionType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAllocateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Allocate Bed</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Ward Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalBeds}</div>
            <p className="text-xs text-muted-foreground">
              Across all wards
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.occupiedBeds}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalStats.occupiedBeds / totalStats.totalBeds) * 100)}% occupancy
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.availableBeds}</div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.maintenanceBeds}</div>
            <p className="text-xs text-muted-foreground">
              Under maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wards, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterWard} onValueChange={setFilterWard}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by ward type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            <SelectItem value="General">General Wards</SelectItem>
            <SelectItem value="ICU">ICU</SelectItem>
            <SelectItem value="Pediatric">Pediatric</SelectItem>
            <SelectItem value="Maternity">Maternity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ward Details */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ward Status ({filteredWards.length})</CardTitle>
            <CardDescription>Real-time bed availability by ward</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredWards.map((ward) => (
                <div key={ward.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <div className="font-medium">{ward.name}</div>
                      <div className="text-sm text-muted-foreground">{ward.location}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {ward.occupiedBeds}/{ward.totalBeds} occupied
                        </span>
                        {ward.availableBeds > 0 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {ward.availableBeds} available
                          </span>
                        )}
                        {ward.maintenanceBeds > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            {ward.maintenanceBeds} maintenance
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <Badge variant={getOccupancyColor(ward.occupancyRate)}>
                      {ward.occupancyRate}%
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleBedMaintenance(ward.id)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities ({activities.length})</CardTitle>
            <CardDescription>Latest bed allocations and transfers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="space-y-1 flex-1">
                    <div className="text-sm font-medium">
                      {activity.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
