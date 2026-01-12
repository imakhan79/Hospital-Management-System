
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AddInventoryItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: (item: any) => void;
}

const categories = ['Medications', 'Supplies', 'Equipment', 'Lab Materials', 'Surgical Tools'];
const locations = ['Main Storage', 'Pharmacy', 'Laboratory', 'Surgery Wing', 'Emergency Room'];
const units = ['piece', 'box', 'bottle', 'pack', 'kit', 'vial', 'case', 'each'];

export function AddInventoryItemForm({ open, onOpenChange, onItemAdded }: AddInventoryItemFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    currentStock: "",
    minimumStock: "",
    unit: "",
    purchasePrice: "",
    sellingPrice: "",
    expiryDate: "",
    location: "",
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

      const newItem = {
        id: `item-${Date.now()}`,
        name: formData.name,
        sku: formData.sku || `SKU-${10000 + Math.floor(Math.random() * 9000)}`,
        category_name: formData.category,
        current_stock: parseInt(formData.currentStock),
        minimum_stock: parseInt(formData.minimumStock),
        unit: formData.unit,
        purchase_price: parseFloat(formData.purchasePrice),
        selling_price: parseFloat(formData.sellingPrice),
        expiry_date: formData.expiryDate || null,
        location: formData.location
      };

      onItemAdded(newItem);
      
      toast({
        title: "Item Added Successfully",
        description: `${newItem.name} has been added to the inventory.`,
      });

      // Reset form
      setFormData({
        name: "",
        sku: "",
        category: "",
        currentStock: "",
        minimumStock: "",
        unit: "",
        purchasePrice: "",
        sellingPrice: "",
        expiryDate: "",
        location: "",
        notes: ""
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomUnit = units[Math.floor(Math.random() * units.length)];
    const randomPrice = (Math.random() * 1000 + 50).toFixed(2);
    const randomStock = Math.floor(Math.random() * 100) + 10;
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    setFormData({
      name: `Medical Item ${Math.floor(Math.random() * 1000) + 1}`,
      sku: `SKU-${10000 + Math.floor(Math.random() * 9000)}`,
      category: randomCategory,
      currentStock: randomStock.toString(),
      minimumStock: Math.floor(randomStock * 0.3).toString(),
      unit: randomUnit,
      purchasePrice: randomPrice,
      sellingPrice: (parseFloat(randomPrice) * 1.3).toFixed(2),
      expiryDate: expiryDate.toISOString().split('T')[0],
      location: randomLocation,
      notes: "Auto-generated demo item"
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
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new item to the medical inventory
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

          {/* Basic Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>

          {/* Category and Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock Information */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={(e) => setFormData(prev => ({ ...prev, currentStock: e.target.value }))}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumStock">Minimum Stock *</Label>
              <Input
                id="minimumStock"
                type="number"
                min="0"
                value={formData.minimumStock}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumStock: e.target.value }))}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (Rs.) *</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (Rs.) *</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.sellingPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about this item"
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
              disabled={loading || !formData.name || !formData.category}
              className="w-full sm:flex-1"
            >
              {loading ? "Adding Item..." : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
