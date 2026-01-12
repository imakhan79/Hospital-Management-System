
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock, Phone, FileText } from "lucide-react";

export interface Notification {
  id: string;
  type: 'emergency' | 'lab' | 'appointment' | 'pharmacy' | 'billing' | 'system';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  department: string;
  patientId?: string;
  isRead: boolean;
  actionRequired?: boolean;
}

interface RealTimeNotificationsProps {
  onNotificationAction?: (notification: Notification) => void;
}

export const RealTimeNotifications = ({ onNotificationAction }: RealTimeNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize with some sample notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'emergency',
        priority: 'critical',
        title: 'Cardiac Emergency',
        message: 'Patient #2045 requires immediate attention in Room 305',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        department: 'Cardiology',
        patientId: 'P2045',
        isRead: false,
        actionRequired: true
      },
      {
        id: '2',
        type: 'lab',
        priority: 'high',
        title: 'Critical Lab Results',
        message: 'Abnormal cardiac enzyme levels for Patient #1823',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        department: 'Laboratory',
        patientId: 'P1823',
        isRead: false,
        actionRequired: true
      },
      {
        id: '3',
        type: 'pharmacy',
        priority: 'medium',
        title: 'Low Stock Alert',
        message: 'O2 Cylinders running low (5 remaining)',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        department: 'Pharmacy',
        isRead: false,
        actionRequired: false
      }
    ];

    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.isRead).length);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: ['emergency', 'lab', 'appointment', 'pharmacy'][Math.floor(Math.random() * 4)] as any,
        priority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any,
        title: 'New System Alert',
        message: `Alert received at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        department: ['Emergency', 'Laboratory', 'Cardiology', 'Pharmacy'][Math.floor(Math.random() * 4)],
        patientId: `P${Math.floor(Math.random() * 9999)}`,
        isRead: false,
        actionRequired: Math.random() > 0.5
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
    }, 60000); // New notification every minute

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'lab':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'appointment':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pharmacy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="outline" 
            onClick={() => {
              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
              setUnreadCount(0);
            }}
          >
            Mark All Read
          </Button>
        </div>
        <CardDescription>
          Real-time system alerts and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.isRead 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getNotificationIcon(notification.type)}
                    <span className="font-medium text-sm">{notification.title}</span>
                    <Badge variant={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{notification.department}</span>
                    <span>{formatTimestamp(notification.timestamp)}</span>
                  </div>
                  
                  {notification.patientId && (
                    <div className="mt-1">
                      <Badge variant="outline">
                        {notification.patientId}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {notification.actionRequired && (
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      markAsRead(notification.id);
                      onNotificationAction?.(notification);
                    }}
                  >
                    Take Action
                  </Button>
                  {notification.type === 'emergency' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        markAsRead(notification.id);
                        // Handle emergency call
                      }}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
