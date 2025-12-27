import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
export const ERPAreaChart = ({ data, xKey, yKey, color = 'hsl(var(--primary))', className, }) => {
    return (<div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
          <XAxis dataKey={xKey} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }}/>
          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }}/>
          <Tooltip contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
        }}/>
          <Area type="monotone" dataKey={yKey} stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>);
};
export const ERPBarChart = ({ data, xKey, yKey, color = 'hsl(var(--primary))', className, }) => {
    return (<div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
          <XAxis dataKey={xKey} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }}/>
          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }}/>
          <Tooltip contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
        }}/>
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>);
};
export const ERPLineChart = ({ data, xKey, yKeys, colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'], className, }) => {
    return (<div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
          <XAxis dataKey={xKey} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }}/>
          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }}/>
          <Tooltip contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
        }}/>
          <Legend />
          {yKeys.map((key, index) => (<Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={2} dot={{ fill: colors[index % colors.length], strokeWidth: 2 }}/>))}
        </LineChart>
      </ResponsiveContainer>
    </div>);
};
export const ERPPieChart = ({ data, dataKey, nameKey, colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
], className, }) => {
    return (<div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={2}>
            {data.map((_, index) => (<Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>))}
          </Pie>
          <Tooltip contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
        }}/>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>);
};
