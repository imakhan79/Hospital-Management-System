
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X, Save, User, Phone, Mail, MapPin, Briefcase, Calendar } from "lucide-react";

interface AddStaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStaffAdded: (staff: any) => void;
}

const AddStaffForm = ({ open, onOpenChange, onStaffAdded }: AddStaffFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    shift: "",
    contact: "",
    email: "",
    address: "",
    experience: "",
    specialization: "",
    salary: "",
    joinDate: "",
    emergencyContact: "",
    bloodType: "",
    cnic: "",
    qualifications: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const departments = [
    "Cardiology", "Neurology", "Emergency", "Surgery", 
    "Pediatrics", "ICU", "Pharmacy", "Laboratory", 
    "Radiology", "Orthopedics", "General Medicine"
  ];

  const roles = [
    "Doctor", "Nurse", "Technician", "Administrator", 
    "Pharmacist", "Lab Technician", "Receptionist", 
    "Security", "Cleaner", "Driver"
  ];

  const shifts = ["Morning", "Evening", "Night", "Rotating"];
  const bloodTypes = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDemoData = () => {
    const demoData = {
      name: "Dr. Sarah Ahmad",
      role: "Doctor",
      department: "Cardiology",
      shift: "Morning",
      contact: "+92-300-1234567",
      email: "sarah.ahmad@hospital.com",
      address: "123 Medical Street, Lahore",
      experience: "5 years",
      specialization: "Cardiology",
      salary: "150000",
      joinDate: "2024-01-15",
      emergencyContact: "+92-300-7654321",
      bloodType: "O+",
      cnic: "35202-1234567-8",
      qualifications: "MBBS, MD Cardiology"
    };
    setFormData(demoData);
    toast({
      title: "Demo Data Loaded",
      description: "Sample staff data has been filled in the form.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = ['name', 'role', 'department', 'shift', 'contact'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newStaff = {
        id: `staff-${Date.now()}`,
        staff_id: `S${String(Math.floor(Math.random() * 9999) + 1000).padStart(4, '0')}`,
        ...formData,
        status: 'On Duty',
        hire_date: formData.joinDate || new Date().toISOString().split('T')[0]
      };

      onStaffAdded(newStaff);
      
      toast({
        title: "Staff Added Successfully",
        description: `${formData.name} has been added to the system.`,
      });

      // Reset form
      setFormData({
        name: "", role: "", department: "", shift: "", contact: "",
        email: "", address: "", experience: "", specialization: "",
        salary: "", joinDate: "", emergencyContact: "", bloodType: "",
        cnic: "", qualifications: ""
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add staff member. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Staff Member
          </DialogTitle>
          <DialogDescription>
            Fill in the details to add a new staff member to the system.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button 
            onClick={generateDemoData} 
            variant="outline" 
            size="sm"
            className="w-full sm:w-auto"
          >
            Load Demo Data
          </Button>
          <Badge variant="secondary" className="hidden sm:flex">
            Demo data available for testing
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnic">CNIC</Label>
                <Input
                  id="cnic"
                  value={formData.cnic}
                  onChange={(e) => handleInputChange('cnic', e.target.value)}
                  placeholder="35202-1234567-8"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    placeholder="+92-300-1234567"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@hospital.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="+92-300-7654321"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Complete address"
                    className="pl-10"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">Shift *</Label>
                <Select value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map(shift => (
                      <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="e.g., 5 years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="Area of expertise"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Salary (Rs.)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="150000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Joining Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Textarea
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange('qualifications', e.target.value)}
                  placeholder="Educational qualifications and certifications"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Adding..." : "Add Staff Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffForm;
