
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateSystemPatients } from "@/services/systemService";

interface OrderNewTestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTestOrdered: (test: any) => void;
}

const testTypes = [
  'Blood Test',
  'Complete Blood Count (CBC)',
  'Comprehensive Metabolic Panel',
  'Lipid Panel',
  'Thyroid Function Test',
  'Liver Function Test',
  'Kidney Function Test',
  'Urinalysis',
  'Hemoglobin A1C',
  'X-Ray',
  'CT Scan',
  'MRI Scan',
  'Ultrasound',
  'ECG',
  'Echocardiogram',
  'Stress Test',
  'Colonoscopy',
  'Endoscopy'
];

const priorities = ['Normal', 'Urgent', 'STAT'];
const doctors = [
  'Dr. John Smith',
  'Dr. Sarah Johnson', 
  'Dr. Michael Lee',
  'Dr. Emily Chen',
  'Dr. David Wilson',
  'Dr. Lisa Brown',
  'Dr. James Davis',
  'Dr. Maria Garcia'
];

export function OrderNewTestForm({ open, onOpenChange, onTestOrdered }: OrderNewTestFormProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    testType: "",
    priority: "",
    requestedBy: "",
    specialInstructions: "",
    fastingRequired: false,
    scheduledDate: "",
    scheduledTime: ""
  });
  const [loading, setLoading] = useState(false);
  const [patients] = useState(generateSystemPatients());
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const selectedPatient = patients.find(p => p.id === formData.patientId);
      const today = new Date();
      const scheduledDateTime = formData.scheduledDate && formData.scheduledTime 
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
        : new Date(today.getTime() + (24 * 60 * 60 * 1000)); // Tomorrow

      const newTest = {
        id: `test-${Date.now()}`,
        patient_id: formData.patientId,
        patient_name: selectedPatient?.name || 'Unknown Patient',
        test_type: formData.testType,
        status: 'Pending',
        priority: formData.priority,
        ordered_date: today.toISOString(),
        scheduled_date: scheduledDateTime.toISOString(),
        requested_by: formData.requestedBy,
        special_instructions: formData.specialInstructions,
        fasting_required: formData.fastingRequired,
        results: null,
        completed_date: null
      };

      onTestOrdered(newTest);
      
      toast({
        title: "Test Ordered Successfully",
        description: `${newTest.test_type} has been ordered for ${selectedPatient?.name}.`,
      });

      // Reset form
      setFormData({
        patientId: "",
        testType: "",
        priority: "",
        requestedBy: "",
        specialInstructions: "",
        fastingRequired: false,
        scheduledDate: "",
        scheduledTime: ""
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to order test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const randomTestType = testTypes[Math.floor(Math.random() * testTypes.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const scheduledDate = tomorrow.toISOString().split('T')[0];
    const scheduledTime = "09:00";

    setFormData({
      patientId: randomPatient.id,
      testType: randomTestType,
      priority: randomPriority,
      requestedBy: randomDoctor,
      specialInstructions: "Standard procedure. Patient informed about preparation requirements.",
      fastingRequired: Math.random() > 0.7,
      scheduledDate,
      scheduledTime
    });

    toast({
      title: "Demo Data Loaded",
      description: "Form filled with sample data for testing.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order New Laboratory Test</DialogTitle>
          <DialogDescription>
            Create a new test order for a patient
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Demo Data Button */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                type="button" 
                variant="outline" 
                onClick={loadDemoData}
                className="w-full sm:w-auto"
              >
                Load Demo Data
              </Button>
            </CardContent>
          </Card>

          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">Patient *</Label>
            <Select 
              value={formData.patientId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.slice(0, 20).map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} - {patient.patient_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Test Type and Priority */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type *</Label>
              <Select 
                value={formData.testType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, testType: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  {testTypes.map((testType) => (
                    <SelectItem key={testType} value={testType}>
                      {testType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requested By */}
          <div className="space-y-2">
            <Label htmlFor="requestedBy">Requested By *</Label>
            <Select 
              value={formData.requestedBy} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, requestedBy: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select requesting doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schedule */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Scheduled Time</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Fasting Required */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="fastingRequired"
              checked={formData.fastingRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, fastingRequired: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="fastingRequired">Fasting Required</Label>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder="Any special instructions or preparation requirements"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.patientId || !formData.testType || !formData.priority || !formData.requestedBy}
              className="w-full sm:flex-1"
            >
              {loading ? "Ordering Test..." : "Order Test"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
