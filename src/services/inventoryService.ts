
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem, InventoryTransaction } from "@/types";

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  try {
    // We'll skip trying to query Supabase tables that don't exist and just use mock data
    console.info("Falling back to mock inventory data");
    return generateMockInventoryItems();
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    // Return mock data if there's an error
    return generateMockInventoryItems();
  }
}

export async function fetchInventoryTransactions(): Promise<InventoryTransaction[]> {
  try {
    // We'll skip trying to query Supabase tables that don't exist and just use mock data
    console.info("Falling back to mock inventory transactions data");
    return generateMockInventoryTransactions();
  } catch (error) {
    console.error("Error fetching inventory transactions:", error);
    // Return mock data if there's an error
    return generateMockInventoryTransactions();
  }
}

// Function to generate sample inventory data
function generateMockInventoryItems(): InventoryItem[] {
  const categories = ['Medications', 'Supplies', 'Equipment', 'Lab Materials', 'Surgical Tools'];
  const locations = ['Main Storage', 'Pharmacy', 'Laboratory', 'Surgery Wing', 'Emergency Room'];
  const units = ['piece', 'box', 'bottle', 'pack', 'kit', 'vial', 'case', 'each'];
  
  return Array.from({ length: 50 }, (_, i) => {
    const categoryIndex = i % categories.length;
    const price = Math.round((10 + Math.random() * 990) * 100) / 100;
    const currentStock = Math.floor(Math.random() * 100) + 1;
    
    return {
      id: `item-${i + 1}`,
      name: `Medical Item ${i + 1}`,
      sku: `SKU-${10000 + i}`,
      category_name: categories[categoryIndex],
      current_stock: currentStock,
      minimum_stock: Math.floor(currentStock * 0.3),
      unit: units[i % units.length],
      purchase_price: price,
      selling_price: price * 1.3,
      expiry_date: i % 3 === 0 ? 
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() : 
        null,
      location: locations[i % locations.length]
    };
  });
}

// Function to generate sample inventory transactions
function generateMockInventoryTransactions(): InventoryTransaction[] {
  const transactionTypes = ['purchase', 'sale', 'return', 'adjustment', 'transfer'];
  const staffMembers = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const typeIndex = i % transactionTypes.length;
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: `trans-${i + 1}`,
      item_name: `Medical Item ${Math.floor(Math.random() * 50) + 1}`,
      transaction_type: transactionTypes[typeIndex],
      quantity: Math.floor(Math.random() * 20) + 1,
      transaction_date: pastDate.toISOString(),
      reference_number: `REF-${2000 + i}`,
      notes: i % 3 === 0 ? `Note for transaction ${i + 1}` : '',
      created_by: staffMembers[i % staffMembers.length]
    };
  });
}
