'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { useToast } from '@/components/ui/use-toast';

export function PreferenceSettings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [compactView, setCompactView] = useState(false);
  const [defaultView, setDefaultView] = useState('dashboard');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      title: 'Theme updated',
      description: `Theme has been changed to ${newTheme}.`,
    });
  };

  const handleCompactViewChange = (checked: boolean) => {
    setCompactView(checked);
    toast({
      title: 'View preference updated',
      description: `Compact view has been ${checked ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preference Settings</h2>
          <p className="text-sm text-muted-foreground">
            Customize your app experience.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact View</Label>
              <p className="text-sm text-muted-foreground">
                Reduce padding and margins for a denser layout
              </p>
            </div>
            <Switch
              checked={compactView}
              onCheckedChange={handleCompactViewChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Default View</Label>
            <Select value={defaultView} onValueChange={setDefaultView}>
              <SelectTrigger>
                <SelectValue placeholder="Select default view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="expenses">Expenses</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}