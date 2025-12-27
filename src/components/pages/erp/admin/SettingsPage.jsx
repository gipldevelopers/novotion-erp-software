import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
export const SettingsPage = () => (<div className="space-y-6 animate-fade-in">
    <div className="flex justify-between"><div className="page-header"><h1 className="page-title">Settings</h1><p className="page-description">System configuration</p></div><Button><Save className="h-4 w-4 mr-2"/>Save</Button></div>
    <div className="grid gap-6">
      <Card><CardHeader><CardTitle>Company Information</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Company Name</Label><Input defaultValue="My Company Inc"/></div>
        <div className="space-y-2"><Label>Email</Label><Input defaultValue="contact@company.com"/></div>
        <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+1 555-0100"/></div>
        <div className="space-y-2"><Label>Address</Label><Input defaultValue="123 Business St"/></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex items-center justify-between"><div><p className="font-medium">Email Notifications</p><p className="text-sm text-muted-foreground">Receive email alerts</p></div><Switch defaultChecked/></div>
        <div className="flex items-center justify-between"><div><p className="font-medium">Invoice Reminders</p><p className="text-sm text-muted-foreground">Auto-send payment reminders</p></div><Switch defaultChecked/></div>
        <div className="flex items-center justify-between"><div><p className="font-medium">Low Stock Alerts</p><p className="text-sm text-muted-foreground">Alert when inventory is low</p></div><Switch /></div>
      </CardContent></Card>
    </div>
  </div>);
