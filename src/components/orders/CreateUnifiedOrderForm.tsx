
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  patient_id: string;
}

interface UnifiedOrder {
  patient_id: string;
  patient_name: string;
  order_type: 'lab' | 'pharmacy';
  item_name: string;
  status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  priority: 'Normal' | 'Urgent' | 'STAT';
  ordered_date: string;
  ordered_by: string;
  department: string;
  notes?: string;
  quantity?: number;
  dosage?: string;
  instructions?: string;
}

interface CreateUnifiedOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated: (order: Omit<UnifiedOrder, 'id'>) => void;
  patients: Patient[];
}

const labTests = [
  'Complete Blood Count (CBC)',
  'Basic Metabolic Panel',
  'Lipid Panel',
  'Thyroid Function Test',
  'Liver Function Test',
  'Kidney Function Test',
  'Urinalysis',
  'Hemoglobin A1C',
  'X-Ray Chest',
  'ECG',
  'Ultrasound Abdomen'
];

const medications = [
  'Paracetamol 500mg',
  'Amoxicillin 250mg',
  'Metformin 500mg',
  'Lisinopril 10mg',
  'Atorvastatin 20mg',
  'Omeprazole 20mg',
  'Aspirin 75mg',
  'Insulin Rapid Acting',
  'Salbutamol Inhaler',
  'Ciprofloxacin 500mg'
];

const doctors = [
  'Dr. Ahmed Ali',
  'Dr. Fatima Shah', 
  'Dr. Hassan Malik',
  'Dr. Ayesha Khan',
  'Dr. Usman Tariq',
  'Dr. Sana Hussain',
  'Dr. Bilal Ahmed',
  'Dr. Mariam Qureshi'
];

export function CreateUnifiedOrderForm({ open, onOpenChange, onOrderCreated, patients }: CreateUnifiedOrderFormProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    orderType: "",
    itemName: "",
    priority: "",
    orderedBy: "",
    notes: "",
    quantity: "",
    dosage: "",
    instructions: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const selectedPatient = patients.find(p => p.id === formData.patientId);
      
      const newOrder: Omit<UnifiedOrder, 'id'> = {
        patient_id: formData.patientId,
        patient_name: selectedPatient?.name || 'Unknown Patient',
        order_type: formData.orderType as 'lab' | 'pharmacy',
        item_name: formData.itemName,
        status: 'Pending',
        priority: formData.priority as 'Normal' | 'Urgent' | 'STAT',
        ordered_date: new Date().toISOString(),
        ordered_by: formData.orderedBy,
        department: formData.orderType === 'lab' ? 'Laboratory' : 'Pharmacy',
        notes: formData.notes || undefined,
        quantity: formData.orderType === 'pharmacy' && formData.quantity ? parseInt(formData.quantity) : undefined,
        dosage: formData.orderType === 'pharmacy' ? formData.dosage : undefined,
        instructions: formData.orderType === 'pharmacy' ? formData.instructions : undefined
      };

      onOrderCreated(newOrder);
      
      toast({
        title: "Order Created Successfully",
        description: `${formData.orderType === 'lab' ? 'Lab test' : 'Medication'} order created for ${selectedPatient?.name}.`,
      });

      // Reset form
      setFormData({
        patientId: "",
        orderType: "",
        itemName: "",
        priority: "",
        orderedBy: "",
        notes: "",
        quantity: "",
        dosage: "",
        instructions: ""
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const randomOrderType = Math.random() > 0.5 ? 'lab' : 'pharmacy';
    const randomItem = randomOrderType === 'lab' 
      ? labTests[Math.floor(Math.random() * labTests.length)]
      : medications[Math.floor(Math.random() * medications.length)];
    const randomPriority = ['Normal', 'Urgent', 'STAT'][Math.floor(Math.random() * 3)];
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    setFormData({
      patientId: randomPatient.id,
      orderType: randomOrderType,
      itemName: randomItem,
      priority: randomPriority,
      orderedBy: randomDoctor,
      notes: "Standard procedure - patient informed",
      quantity: randomOrderType === 'pharmacy' ? "30" : "",
      dosage: randomOrderType === 'pharmacy' ? "1 tablet twice daily" : "",
      instructions: randomOrderType === 'pharmacy' ? "Take with food" : ""
    });

    toast({
      title: "Demo Data Loaded",
      description: "Form filled with sample data for testing.",
    });
  };

  const availableItems = formData.orderType === 'lab' ? labTests : medications;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Create a unified order for laboratory tests or pharmacy medications
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

          {/* Order Type */}
          <div className="space-y-2">
            <Label htmlFor="orderType">Order Type *</Label>
            <Select 
              value={formData.orderType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, orderType: value, itemName: "" }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab">Laboratory Test</SelectItem>
                <SelectItem value="pharmacy">Pharmacy Medication</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Item Selection */}
          {formData.orderType && (
            <div className="space-y-2">
              <Label htmlFor="itemName">
                {formData.orderType === 'lab' ? 'Test Type' : 'Medication'} *
              </Label>
              <Select 
                value={formData.itemName} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, itemName: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${formData.orderType === 'lab' ? 'test' : 'medication'}`} />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Priority and Doctor */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="STAT">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderedBy">Ordered By *</Label>
              <Select 
                value={formData.orderedBy} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, orderedBy: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
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
          </div>

          {/* Pharmacy-specific fields */}
          {formData.orderType === 'pharmacy' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 1 tablet twice daily"
                />
              </div>
            </div>
          )}

          {/* Instructions/Notes */}
          <div className="space-y-2">
            <Label htmlFor={formData.orderType === 'pharmacy' ? 'instructions' : 'notes'}>
              {formData.orderType === 'pharmacy' ? 'Instructions' : 'Notes'}
            </Label>
            <Textarea
              id={formData.orderType ===   'pharmacy' ? 'instructions' : 'notes'}
              value={formData.orderType === 'pharmacy' ? formData.instructions : formData.notes}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                [formData.orderType === 'pharmacy' ? 'instructions' : 'notes']: e.target.value 
              }))}
              placeholder={formData.orderType === 'pharmacy' 
                ? "Special instructions for medication administration"
                : "Any special notes or requirements"
              }
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
              disabled={loading || !formData.patientId || !formData.orderType || !formData.itemName || !formData.priority || !formData.orderedBy}
              className="w-full sm:flex-1"
            >
              {loading ? "Creating Order..." : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
