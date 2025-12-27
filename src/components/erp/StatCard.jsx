import { cn } from '@/lib/utils';
export const StatCard = ({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'text-primary', className, }) => {
    return (<div className={cn('bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:shadow-md hover:border-primary/20', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {change && (<p className={cn('text-sm font-medium', changeType === 'positive' && 'text-success', changeType === 'negative' && 'text-destructive', changeType === 'neutral' && 'text-muted-foreground')}>
              {change}
            </p>)}
        </div>
        <div className={cn('p-3 rounded-lg bg-primary/10', iconColor)}>
          <Icon className="h-5 w-5"/>
        </div>
      </div>
    </div>);
};
