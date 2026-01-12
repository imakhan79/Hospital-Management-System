
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateBillingData } from "@/services/systemService";

interface CreateInvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated: (invoice: any) => void;
}

const demoPatients = [
  { id: "1", name: "John Smith", patientId: "P001" },
  { id: "2", name: "Sarah Johnson", patientId: "P002" },
  { id: "3", name: "Michael Brown", patientId: "P003" },
  { id: "4", name: "Emily Davis", patientId: "P004" },
  { id: "5", name: "David Wilson", patientId: "P005" },
];

const serviceCategories = [
  "Consultation",
  "Diagnostic Tests",
  "Surgery",
  "Emergency Care",
  "Pharmacy",
  "Laboratory",
  "Radiology",
  "Physiotherapy"
];

export function CreateInvoiceForm({ open, onOpenChange, onInvoiceCreated }: CreateInvoiceFormProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    serviceCategory: "",
    description: "",
    amount: "",
    dueDate: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const selectedPatient = demoPatients.find(p => p.id === formData.patientId);
      
      const newInvoice = {
        id: `inv-${Date.now()}`,
        invoice_number: `INV-${10000 + Math.floor(Math.random() * 9000)}`,
        patient_name: selectedPatient?.name || "Unknown Patient",
        amount: parseFloat(formData.amount),
        paid_amount: 0,
        status: "Pending",
        due_date: formData.dueDate,
        service_category: formData.serviceCategory,
        description: formData.description,
        notes: formData.notes,
        created_date: new Date().toISOString().split('T')[0]
      };

      onInvoiceCreated(newInvoice);
      
      toast({
        title: "Invoice Created Successfully",
        description: `Invoice ${newInvoice.invoice_number} has been generated for ${selectedPatient?.name}.`,
      });

      // Reset form
      setFormData({
        patientId: "",
        serviceCategory: "",
        description: "",
        amount: "",
        dueDate: "",
        notes: ""
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    const randomPatient = demoPatients[Math.floor(Math.random() * demoPatients.length)];
    const randomService = serviceCategories[Math.floor(Math.random() * serviceCategories.length)];
    const randomAmount = (Math.random() * 5000 + 500).toFixed(2);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    setFormData({
      patientId: randomPatient.id,
      serviceCategory: randomService,
      description: `${randomService} services provided`,
      amount: randomAmount,
      dueDate: dueDate.toISOString().split('T')[0],
      notes: "Standard billing terms apply"
    });

    toast({
      title: "Demo Data Loaded",
      description: "Form filled with sample data for testing.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Generate a new invoice for patient services
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select 
                value={formData.patientId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {demoPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceCategory">Service Category *</Label>
              <Select 
                value={formData.serviceCategory} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceCategory: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description and Amount */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Service Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of services"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rs.) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes or special instructions"
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
              disabled={loading || !formData.patientId || !formData.amount}
              className="w-full sm:flex-1"
            >
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
