'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Key } from 'lucide-react';

export function SecuritySettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTwoFactorEnabled(enabled);
      toast({
        title: '2FA ' + (enabled ? 'enabled' : 'disabled'),
        description: `Two-factor authentication has been ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update 2FA settings.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Security Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account security settings.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Label>Two-Factor Authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <Label>Change Password</Label>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  required
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  required
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm new password"
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Card>
  );
}