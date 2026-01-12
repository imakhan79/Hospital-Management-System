import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ambulance, MapPin, Clock, Phone, AlertTriangle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AmbulanceDispatch {
  id: string;
  dispatchNumber: string;
  ambulanceId: string;
  dispatchTime: string;
  pickupLocation: string;
  patientName?: string;
  patientAge?: number;
  chiefComplaint?: string;
  priorityLevel: number;
  eta?: string;
  arrivalTime?: string;
  status: string;
  crewMembers: string[];
  equipmentUsed: string[];
  notes?: string;
}

export function AmbulanceTracking() {
  const { toast } = useToast();
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [newDispatch, setNewDispatch] = useState({
    ambulanceId: "",
    pickupLocation: "",
    patientName: "",
    patientAge: "",
    chiefComplaint: "",
    priorityLevel: 3,
    crewMembers: "",
    notes: ""
  });

  // Mock ambulance dispatch data
  const dispatches: AmbulanceDispatch[] = [
    {
      id: "1",
      dispatchNumber: "AMB-001",
      ambulanceId: "AMB-101",
      dispatchTime: "2024-01-04 15:45",
      pickupLocation: "Main Street & 5th Avenue",
      patientName: "Zainab Ahmed",
      patientAge: 35,
      chiefComplaint: "Motor vehicle accident",
      priorityLevel: 1,
      eta: "2024-01-04 16:15",
      status: "en_route",
      crewMembers: ["Paramedic Ahmed", "EMT Fatima"],
      equipmentUsed: ["oxygen", "backboard", "IV"],
      notes: "Multiple vehicle collision, possible head injury"
    },
    {
      id: "2",
      dispatchNumber: "AMB-002", 
      ambulanceId: "AMB-102",
      dispatchTime: "2024-01-04 15:30",
      pickupLocation: "Green Park Apartments, Building B",
      patientName: "Hassan Ali",
      patientAge: 65,
      chiefComplaint: "Difficulty breathing",
      priorityLevel: 2,
      arrivalTime: "2024-01-04 16:00",
      status: "arrived",
      crewMembers: ["Paramedic Sarah", "EMT Ahmed"],
      equipmentUsed: ["nebulizer", "oxygen", "wheelchair"],
      notes: "Patient stable, responding to treatment"
    },
    {
      id: "3",
      dispatchNumber: "AMB-003",
      ambulanceId: "AMB-103",
      dispatchTime: "2024-01-04 14:20",
      pickupLocation: "City Center Mall",
      patientName: "Mariam Shah",
      patientAge: 28,
      chiefComplaint: "Severe allergic reaction",
      priorityLevel: 1,
      arrivalTime: "2024-01-04 15:45",
      status: "completed",
      crewMembers: ["Paramedic Ali", "EMT Zainab"],
      equipmentUsed: ["epinephrine", "oxygen", "IV", "monitor"],
      notes: "Anaphylactic reaction to food, responded well to epinephrine"
    }
  ];

  // Mock available ambulances
  const availableAmbulances = [
    { id: "AMB-104", status: "available", location: "Station 1" },
    { id: "AMB-105", status: "available", location: "Station 2" },
    { id: "AMB-106", status: "maintenance", location: "Garage" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dispatched": return "secondary";
      case "en_route": return "default";
      case "arrived": return "outline";
      case "completed": return "default";
      default: return "outline";
    }
  };

  const getPriorityColor = (level: number) => {
    switch (level) {
      case 1: return "destructive"; // Critical
      case 2: return "secondary"; // Urgent  
      case 3: return "outline"; // Non-urgent
      default: return "outline";
    }
  };

  const getPriorityLabel = (level: number) => {
    switch (level) {
      case 1: return "Critical";
      case 2: return "Urgent";
      case 3: return "Non-urgent";
      default: return "Unknown";
    }
  };

  const handleDispatchSubmit = () => {
    const dispatchNumber = `AMB-${String(Date.now()).slice(-3)}`;
    
    toast({
      title: "Ambulance Dispatched",
      description: `Dispatch ${dispatchNumber} created for ${newDispatch.ambulanceId}`,
    });

    // Reset form
    setNewDispatch({
      ambulanceId: "",
      pickupLocation: "",
      patientName: "",
      patientAge: "",
      chiefComplaint: "",
      priorityLevel: 3,
      crewMembers: "",
      notes: ""
    });
    setShowDispatchForm(false);
  };

  const updateDispatchStatus = (dispatchId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Dispatch status updated to ${newStatus.replace("_", " ")}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ambulance Tracking</h2>
        <Button onClick={() => setShowDispatchForm(!showDispatchForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Dispatch
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Ambulance className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Units</p>
                <p className="text-2xl font-bold text-green-500">
                  {availableAmbulances.filter(a => a.status === "available").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Route</p>
                <p className="text-2xl font-bold text-blue-500">
                  {dispatches.filter(d => d.status === "en_route").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Calls</p>
                <p className="text-2xl font-bold text-red-500">
                  {dispatches.filter(d => d.priorityLevel === 1 && d.status !== "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">8.5m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dispatch Form */}
      {showDispatchForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Ambulance Dispatch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ambulanceId">Ambulance Unit</Label>
                <Select value={newDispatch.ambulanceId} onValueChange={(value) => setNewDispatch({ ...newDispatch, ambulanceId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ambulance unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAmbulances.filter(a => a.status === "available").map((ambulance) => (
                      <SelectItem key={ambulance.id} value={ambulance.id}>
                        {ambulance.id} - {ambulance.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priorityLevel">Priority Level</Label>
                <Select value={newDispatch.priorityLevel.toString()} onValueChange={(value) => setNewDispatch({ ...newDispatch, priorityLevel: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Priority 1 - Critical</SelectItem>
                    <SelectItem value="2">Priority 2 - Urgent</SelectItem>
                    <SelectItem value="3">Priority 3 - Non-urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="pickupLocation">Pickup Location *</Label>
                <Input
                  id="pickupLocation"
                  value={newDispatch.pickupLocation}
                  onChange={(e) => setNewDispatch({ ...newDispatch, pickupLocation: e.target.value })}
                  placeholder="Full address or landmark description"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={newDispatch.patientName}
                  onChange={(e) => setNewDispatch({ ...newDispatch, patientName: e.target.value })}
                  placeholder="Patient's name (if known)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientAge">Patient Age</Label>
                <Input
                  id="patientAge"
                  value={newDispatch.patientAge}
                  onChange={(e) => setNewDispatch({ ...newDispatch, patientAge: e.target.value })}
                  placeholder="Age in years"
                  type="number"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="chiefComplaint">Chief Complaint / Incident Type</Label>
                <Input
                  id="chiefComplaint"
                  value={newDispatch.chiefComplaint}
                  onChange={(e) => setNewDispatch({ ...newDispatch, chiefComplaint: e.target.value })}
                  placeholder="Primary medical complaint or incident type"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="crewMembers">Crew Members</Label>
                <Input
                  id="crewMembers"
                  value={newDispatch.crewMembers}
                  onChange={(e) => setNewDispatch({ ...newDispatch, crewMembers: e.target.value })}
                  placeholder="Paramedic and EMT names (comma separated)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newDispatch.notes}
                  onChange={(e) => setNewDispatch({ ...newDispatch, notes: e.target.value })}
                  placeholder="Special instructions, hazards, or additional details..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleDispatchSubmit} className="flex-1">
                Dispatch Ambulance
              </Button>
              <Button variant="outline" onClick={() => setShowDispatchForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Dispatches */}
      <Card>
        <CardHeader>
          <CardTitle>Active Ambulance Dispatches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispatch #</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Patient Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ETA/Arrival</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispatches.filter(d => d.status !== "completed").map((dispatch) => (
                <TableRow key={dispatch.id}>
                  <TableCell className="font-medium">{dispatch.dispatchNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{dispatch.ambulanceId}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(dispatch.priorityLevel)}>
                      P{dispatch.priorityLevel} - {getPriorityLabel(dispatch.priorityLevel)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm">{dispatch.pickupLocation}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dispatch.patientName ? (
                      <div>
                        <p className="font-medium text-sm">{dispatch.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {dispatch.patientAge && `Age: ${dispatch.patientAge} • `}{dispatch.chiefComplaint}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Unknown patient</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(dispatch.status)}>
                      {dispatch.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {dispatch.eta ? (
                        <span>ETA: {dispatch.eta.split(" ")[1]}</span>
                      ) : dispatch.arrivalTime ? (
                        <span>Arrived: {dispatch.arrivalTime.split(" ")[1]}</span>
                      ) : (
                        <span>--:--</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Dispatch Details - {dispatch.dispatchNumber}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Ambulance Unit</p>
                                <p className="text-sm text-muted-foreground">{dispatch.ambulanceId}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Priority Level</p>
                                <Badge variant={getPriorityColor(dispatch.priorityLevel)}>
                                  P{dispatch.priorityLevel} - {getPriorityLabel(dispatch.priorityLevel)}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Dispatch Time</p>
                                <p className="text-sm text-muted-foreground">{dispatch.dispatchTime}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Current Status</p>
                                <Badge variant={getStatusColor(dispatch.status)}>
                                  {dispatch.status.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Pickup Location</p>
                              <p className="text-sm text-muted-foreground">{dispatch.pickupLocation}</p>
                            </div>
                            
                            {dispatch.patientName && (
                              <div>
                                <p className="text-sm font-medium">Patient Information</p>
                                <p className="text-sm text-muted-foreground">
                                  {dispatch.patientName} ({dispatch.patientAge} years old) - {dispatch.chiefComplaint}
                                </p>
                              </div>
                            )}
                            
                            <div>
                              <p className="text-sm font-medium">Crew Members</p>
                              <p className="text-sm text-muted-foreground">
                                {dispatch.crewMembers.join(", ")}
                              </p>
                            </div>
                            
                            {dispatch.equipmentUsed.length > 0 && (
                              <div>
                                <p className="text-sm font-medium">Equipment Used</p>
                                <div className="flex gap-1 flex-wrap">
                                  {dispatch.equipmentUsed.map((equipment, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {equipment}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {dispatch.notes && (
                              <div>
                                <p className="text-sm font-medium">Notes</p>
                                <p className="text-sm text-muted-foreground">{dispatch.notes}</p>
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-4">
                              {dispatch.status === "dispatched" && (
                                <Button onClick={() => updateDispatchStatus(dispatch.id, "en_route")} size="sm">
                                  Mark En Route
                                </Button>
                              )}
                              {dispatch.status === "en_route" && (
                                <Button onClick={() => updateDispatchStatus(dispatch.id, "arrived")} size="sm">
                                  Mark Arrived
                                </Button>
                              )}
                              {dispatch.status === "arrived" && (
                                <Button onClick={() => updateDispatchStatus(dispatch.id, "completed")} size="sm">
                                  Mark Completed
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Phone className="h-3 w-3 mr-1" />
                                Contact Crew
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recently Completed */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Completed Dispatches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispatch #</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Completion Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispatches.filter(d => d.status === "completed").map((dispatch) => (
                <TableRow key={dispatch.id}>
                  <TableCell className="font-medium">{dispatch.dispatchNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{dispatch.ambulanceId}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{dispatch.patientName}</p>
                      <p className="text-xs text-muted-foreground">{dispatch.chiefComplaint}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{dispatch.pickupLocation}</TableCell>
                  <TableCell className="text-sm">{dispatch.arrivalTime}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}