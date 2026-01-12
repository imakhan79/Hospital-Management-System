
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function SystemSettings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Customize the appearance of the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System Default</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="density">Display Density</Label>
              <Select defaultValue="comfortable">
                <SelectTrigger id="density">
                  <SelectValue placeholder="Select display density" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="fontSize">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure system notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="criticalAlerts">Critical Alerts</Label>
                <div className="text-sm text-muted-foreground">
                  Receive alerts for critical patient events
                </div>
              </div>
              <Switch id="criticalAlerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="systemUpdates">System Updates</Label>
                <div className="text-sm text-muted-foreground">
                  Notifications about system updates and maintenance
                </div>
              </div>
              <Switch id="systemUpdates" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                <div className="text-sm text-muted-foreground">
                  Send automated reminders for upcoming appointments
                </div>
              </div>
              <Switch id="appointmentReminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                <div className="text-sm text-muted-foreground">
                  Notify when inventory items fall below minimum levels
                </div>
              </div>
              <Switch id="inventoryAlerts" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>Configure performance-related settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoRefresh">Auto-Refresh Data</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically refresh data at regular intervals
                </div>
              </div>
              <Switch id="autoRefresh" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="refreshInterval">Refresh Interval</Label>
              <Select defaultValue="5m">
                <SelectTrigger id="refreshInterval">
                  <SelectValue placeholder="Select refresh interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 minute</SelectItem>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Interface Animations</Label>
                <div className="text-sm text-muted-foreground">
                  Enable animations in the user interface
                </div>
              </div>
              <Switch id="animations" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
