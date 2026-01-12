
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SecuritySettings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            
            <div>
              <Button>Update Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                <div className="text-sm text-muted-foreground">
                  Require a code in addition to your password when signing in
                </div>
              </div>
              <Switch id="2fa" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="2faMethod">Authentication Method</Label>
              <Select defaultValue="app">
                <SelectTrigger id="2faMethod">
                  <SelectValue placeholder="Select authentication method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">Authenticator App</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>Manage your active sessions and devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Active Sessions</h3>
              <div className="rounded-md border">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Current Session</div>
                      <div className="text-sm text-muted-foreground">Windows 11 · Chrome · New York, USA</div>
                      <div className="text-xs text-muted-foreground mt-1">Started: May 22, 2025 at 9:42 AM</div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</div>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Mobile App</div>
                      <div className="text-sm text-muted-foreground">iOS 17 · Safari · Boston, USA</div>
                      <div className="text-xs text-muted-foreground mt-1">Started: May 20, 2025 at 3:15 PM</div>
                    </div>
                    <Button variant="outline" size="sm">Sign Out</Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Office Desktop</div>
                      <div className="text-sm text-muted-foreground">macOS · Firefox · New York, USA</div>
                      <div className="text-xs text-muted-foreground mt-1">Started: May 18, 2025 at 11:30 AM</div>
                    </div>
                    <Button variant="outline" size="sm">Sign Out</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Button variant="destructive">Sign Out All Other Sessions</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Log</CardTitle>
          <CardDescription>Review your recent security activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recent Activity</h3>
              <div className="rounded-md border">
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Successful Login</div>
                      <div className="text-sm text-muted-foreground">Windows 11 · Chrome · New York, USA</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Today, 9:42 AM</div>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Password Changed</div>
                      <div className="text-sm text-muted-foreground">Windows 11 · Chrome · New York, USA</div>
                    </div>
                    <div className="text-sm text-muted-foreground">May 15, 2025, 2:30 PM</div>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Failed Login Attempt</div>
                      <div className="text-sm text-muted-foreground">Unknown · Chrome · Chicago, USA</div>
                    </div>
                    <div className="text-sm text-muted-foreground">May 12, 2025, 7:18 AM</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Account Recovery Email Updated</div>
                      <div className="text-sm text-muted-foreground">Windows 11 · Chrome · New York, USA</div>
                    </div>
                    <div className="text-sm text-muted-foreground">May 10, 2025, 11:05 AM</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Button variant="outline">View Full Security Log</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
