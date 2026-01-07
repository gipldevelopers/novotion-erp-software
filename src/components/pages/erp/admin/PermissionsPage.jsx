// Updated: 2025-12-27
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
const modules = ['Dashboard', 'Accounting', 'CRM', 'HRMS', 'POS', 'Admin'];
const actions = ['View', 'Create', 'Edit', 'Delete'];
const roles = ['Admin', 'Manager', 'Accountant', 'Sales', 'Cashier'];
export const PermissionsPage = () => (<div className="space-y-6 animate-fade-in">
    <div className="flex justify-between"><div className="page-header"><h1 className="page-title">Permissions</h1><p className="page-description">Configure role permissions</p></div><Button><Save className="h-4 w-4 mr-2"/>Save Changes</Button></div>
    <Card>
      <CardHeader><CardTitle>Permission Matrix</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b"><th className="text-left p-3">Module</th><th className="text-left p-3">Action</th>{roles.map(r => <th key={r} className="text-center p-3">{r}</th>)}</tr></thead>
            <tbody>
              {modules.map(module => actions.map((action, i) => (<tr key={`${module}-${action}`} className="border-b"><td className="p-3 font-medium">{i === 0 ? module : ''}</td><td className="p-3">{action}</td>
                  {roles.map(role => <td key={role} className="text-center p-3"><Checkbox defaultChecked={role === 'Admin' || (role === 'Manager' && action !== 'Delete')}/></td>)}
                </tr>)))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>);
