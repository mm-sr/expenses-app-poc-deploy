'use client';

import { SettingsForm } from '@/components/settings/SettingsForm';
import { CategoryManager } from '@/components/settings/CategoryManager';
import { DataManagement } from '@/components/settings/DataManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <main className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and data</p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences">
          <SettingsForm />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
        
        <TabsContent value="data">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </main>
  );
}