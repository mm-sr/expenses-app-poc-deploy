'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Bell, PieChart, Mail } from 'lucide-react';

export function NotificationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    monthlyReport: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      toast({
        title: 'Notification settings updated',
        description: `${key} has been ${newSettings[key] ? 'enabled' : 'disabled'}.`,
      });
      return newSettings;
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Notification Settings</h2>
          <p className="text-sm text-muted-foreground">
            Choose how you want to be notified about your expenses and budgets.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label>Email Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label>Budget Alerts</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Get notified when you're close to your budget limits
              </p>
            </div>
            <Switch
              checked={settings.budgetAlerts}
              onCheckedChange={() => handleToggle('budgetAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                <Label>Monthly Report</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive a monthly summary of your expenses
              </p>
            </div>
            <Switch
              checked={settings.monthlyReport}
              onCheckedChange={() => handleToggle('monthlyReport')}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}