
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PurchaseOrderItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface NewPurchaseOrderFormProps {
  onClose?: () => void;
  onSave?: (order: any) => void;
}

export function NewPurchaseOrderForm({ onClose, onSave }: NewPurchaseOrderFormProps) {
  const [supplier, setSupplier] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    itemName: "",
    description: "",
    quantity: 1,
    unitPrice: 0
  });
  const { toast } = useToast();

  const suppliers = [
    "MedSupply Corporation",
    "PharmaCo Limited", 
    "EquipTech Solutions",
    "LabChem Industries",
    "SurgiTools Pvt Ltd"
  ];

  const departments = [
    "Surgery",
    "Pharmacy", 
    "Radiology",
    "Laboratory",
    "Emergency",
    "ICU",
    "General Medicine"
  ];

  const addItem = () => {
    if (!currentItem.itemName || currentItem.quantity <= 0 || currentItem.unitPrice <= 0) {
      toast({
        title: "Invalid Item",
        description: "Please fill all item fields with valid values",
        variant: "destructive"
      });
      return;
    }

    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      itemName: currentItem.itemName,
      description: currentItem.description,
      quantity: currentItem.quantity,
      unitPrice: currentItem.unitPrice,
      totalPrice: currentItem.quantity * currentItem.unitPrice
    };

    setItems([...items, newItem]);
    setCurrentItem({
      itemName: "",
      description: "",
      quantity: 1,
      unitPrice: 0
    });
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSave = (status: 'Draft' | 'Sent') => {
    if (!supplier || !department || !priority || items.length === 0) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all required fields and add at least one item",
        variant: "destructive"
      });
      return;
    }

    const purchaseOrder = {
      id: `PO-${Date.now()}`,
      supplier,
      department,
      priority,
      expectedDate,
      notes,
      items,
      totalAmount: getTotalAmount(),
      status,
      orderDate: new Date().toISOString().split('T')[0],
      requestedBy: "Current User"
    };

    if (onSave) {
      onSave(purchaseOrder);
    }

    toast({
      title: "Purchase Order Created",
      description: `Purchase order ${status.toLowerCase()} successfully`,
    });

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Create New Purchase Order</CardTitle>
            <CardDescription>Fill in the details to create a new purchase order</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(sup => (
                    <SelectItem key={sup} value={sup}>{sup}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
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
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDate">Expected Delivery Date</Label>
              <Input
                id="expectedDate"
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
              />
            </div>
          </div>

          {/* Add Items Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add Items</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  placeholder="Enter item name"
                  value={currentItem.itemName}
                  onChange={(e) => setCurrentItem({...currentItem, itemName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (PKR)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem({...currentItem, unitPrice: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={addItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Item Description</Label>
              <Textarea
                id="description"
                placeholder="Enter item description"
                value={currentItem.description}
                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                rows={2}
              />
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Items</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.itemName}</div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      )}
                      <div className="text-sm">
                        Qty: {item.quantity} × PKR {item.unitPrice} = PKR {item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold">PKR {getTotalAmount().toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes or requirements"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => handleSave('Draft')}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSave('Sent')}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Supplier
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
