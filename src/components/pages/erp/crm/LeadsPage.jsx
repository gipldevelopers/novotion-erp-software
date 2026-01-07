// Updated: 2025-12-27
import { Plus, Download, MoreHorizontal, Eye, Edit, Trash2, ArrowRight } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
const mockLeads = [
    { id: '1', name: 'Robert Chen', email: 'robert@newco.com', company: 'NewCo Inc', stage: 'new', value: 15000, source: 'Website', assignedTo: 'Sales Team', createdAt: '2024-01-20' },
    { id: '2', name: 'Amanda White', email: 'amanda@startup.io', company: 'Startup.io', stage: 'contacted', value: 25000, source: 'Referral', assignedTo: 'John Doe', createdAt: '2024-01-18' },
    { id: '3', name: 'James Miller', email: 'james@enterprise.com', company: 'Enterprise Ltd', stage: 'qualified', value: 50000, source: 'LinkedIn', assignedTo: 'Jane Smith', createdAt: '2024-01-15' },
    { id: '4', name: 'Patricia Davis', email: 'patricia@corp.com', company: 'Corp Solutions', stage: 'proposal', value: 35000, source: 'Trade Show', assignedTo: 'John Doe', createdAt: '2024-01-12' },
    { id: '5', name: 'Michael Brown', email: 'michael@tech.io', company: 'Tech.io', stage: 'negotiation', value: 80000, source: 'Website', assignedTo: 'Jane Smith', createdAt: '2024-01-08' },
    { id: '6', name: 'Jennifer Wilson', email: 'jennifer@bigco.com', company: 'BigCo', stage: 'won', value: 120000, source: 'Referral', assignedTo: 'John Doe', createdAt: '2024-01-05' },
];
const stageColors = {
    new: 'bg-info/10 text-info border-info/20',
    contacted: 'bg-primary/10 text-primary border-primary/20',
    qualified: 'bg-warning/10 text-warning border-warning/20',
    proposal: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
    negotiation: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    won: 'bg-success/10 text-success border-success/20',
    lost: 'bg-destructive/10 text-destructive border-destructive/20',
};
const pipelineStages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won'];
export const LeadsPage = () => {
    const getStageLeads = (stage) => mockLeads.filter((l) => l.stage === stage);
    const getStageValue = (stage) => getStageLeads(stage).reduce((sum, l) => sum + l.value, 0);
    const columns = [
        {
            key: 'name',
            header: 'Lead',
            render: (item) => (<div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.company}</p>
        </div>),
        },
        { key: 'email', header: 'Email' },
        {
            key: 'stage',
            header: 'Stage',
            render: (item) => (<Badge variant="outline" className={stageColors[item.stage]}>
          {item.stage.charAt(0).toUpperCase() + item.stage.slice(1)}
        </Badge>),
        },
        {
            key: 'value',
            header: 'Value',
            render: (item) => (<span className="font-semibold">${item.value.toLocaleString()}</span>),
        },
        { key: 'source', header: 'Source' },
        { key: 'assignedTo', header: 'Assigned To' },
        {
            key: 'actions',
            header: '',
            className: 'w-12',
            render: (item) => (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2"/>
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArrowRight className="h-4 w-4 mr-2"/>
              Move Stage
            </DropdownMenuItem>
            <PermissionGuard permission="leads.edit">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2"/>
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="leads.delete">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2"/>
                Delete
              </DropdownMenuItem>
            </PermissionGuard>
          </DropdownMenuContent>
        </DropdownMenu>),
        },
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Leads Pipeline</h1>
          <p className="page-description">Track and manage sales opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2"/>
            Export
          </Button>
          <PermissionGuard permission="leads.create">
            <Button>
              <Plus className="h-4 w-4 mr-2"/>
              Add Lead
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {pipelineStages.map((stage) => (<Card key={stage}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">{stage}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getStageLeads(stage).length}</p>
              <p className="text-sm text-muted-foreground">
                ${(getStageValue(stage) / 1000).toFixed(0)}K value
              </p>
            </CardContent>
          </Card>))}
      </div>

      <DataTable data={mockLeads} columns={columns} searchable searchKeys={['name', 'email', 'company']}/>
    </div>);
};
