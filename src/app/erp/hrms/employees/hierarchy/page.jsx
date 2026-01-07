'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, ChevronDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const fullName = (e) => `${e?.firstName || ''} ${e?.lastName || ''}`.trim();

const EmployeeCard = ({ employee, isFocus, onClick }) => {
    if (!employee) return null;
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }}
            className={[
                'rounded-xl border bg-card px-4 py-3 shadow-sm transition-all duration-200',
                'hover:bg-muted/40 hover:-translate-y-0.5 hover:shadow-md',
                isFocus ? 'ring-2 ring-primary/60' : '',
            ].join(' ')}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate font-semibold">{fullName(employee)}</div>
                    <div className="truncate text-xs text-muted-foreground">{employee.id}</div>
                </div>
                <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'} className="shrink-0">
                    {employee.status}
                </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {employee.department ? <Badge variant="secondary" className="font-normal">{employee.department}</Badge> : null}
                {employee.designation ? <Badge variant="outline" className="font-normal">{employee.designation}</Badge> : null}
            </div>
        </div>
    );
};

const TreeNode = ({ employeeId, focusId, employeeById, reportsByManager, visited, depth, onFocusChange }) => {
    const emp = employeeById.get(employeeId);
    if (!emp) return null;

    const nextVisited = visited.has(employeeId) ? visited : new Set([...visited, employeeId]);
    const children = (reportsByManager.get(employeeId) || []).filter((c) => !nextVisited.has(c.id));
    const hasChildren = children.length > 0;
    const defaultOpen = depth <= 1;

    return (
        <div className="flex flex-col items-center">
            <Collapsible defaultOpen={defaultOpen}>
                <div className="flex items-center gap-2">
                    <EmployeeCard employee={emp} isFocus={emp.id === focusId} onClick={() => onFocusChange(emp.id)} />
                    {hasChildren ? (
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 [&[data-state=open]>svg]:rotate-180">
                                <ChevronDown className="h-4 w-4 transition-transform" />
                            </Button>
                        </CollapsibleTrigger>
                    ) : null}
                </div>

                {hasChildren ? (
                    <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <div className="relative mt-6 flex flex-col items-center">
                            <div className="absolute -top-4 left-1/2 h-4 w-px bg-border" />
                            <div className="relative w-full pt-4">
                                <div className="absolute left-0 right-0 top-2 h-px bg-border" />
                                <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 px-4">
                                    {children.map((c) => (
                                        <div key={c.id} className="relative flex flex-col items-center pt-4">
                                            <div className="absolute left-1/2 top-0 h-4 w-px bg-border" />
                                            <TreeNode
                                                employeeId={c.id}
                                                focusId={focusId}
                                                employeeById={employeeById}
                                                reportsByManager={reportsByManager}
                                                visited={nextVisited}
                                                depth={depth + 1}
                                                onFocusChange={onFocusChange}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                ) : null}
            </Collapsible>
        </div>
    );
};

export default function EmployeeHierarchyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const focusFromQuery = searchParams.get('focus') || '';

    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [focusId, setFocusId] = useState(focusFromQuery);
    const [search, setSearch] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const data = await hrmsService.getEmployees();
            setEmployees(data);
            if (!focusId && data.length) setFocusId(data[0].id);
        } catch (e) {
            toast.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (focusFromQuery && focusFromQuery !== focusId) setFocusId(focusFromQuery);
    }, [focusFromQuery]);

    const filteredEmployees = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return employees;
        return employees.filter((e) => {
            const hay = `${fullName(e)} ${e.id} ${e.department || ''} ${e.designation || ''}`.toLowerCase();
            return hay.includes(q);
        });
    }, [employees, search]);

    const employeeById = useMemo(() => {
        const map = new Map();
        for (const e of employees) map.set(e.id, e);
        return map;
    }, [employees]);

    const reportsByManager = useMemo(() => {
        const map = new Map();
        for (const e of employees) {
            const mgrId = e.manager || '';
            if (!mgrId) continue;
            if (!map.has(mgrId)) map.set(mgrId, []);
            map.get(mgrId).push(e);
        }
        for (const [mgrId, reports] of map.entries()) {
            reports.sort((a, b) => fullName(a).localeCompare(fullName(b)));
            map.set(mgrId, reports);
        }
        return map;
    }, [employees]);

    const focusEmployee = employeeById.get(focusId) || null;

    const managerChain = useMemo(() => {
        const chain = [];
        let cur = focusEmployee;
        const seen = new Set([focusId]);
        while (cur?.manager) {
            const mgrId = cur.manager;
            if (!mgrId || seen.has(mgrId)) break;
            seen.add(mgrId);
            const mgr = employeeById.get(mgrId);
            if (!mgr) break;
            chain.push(mgr);
            cur = mgr;
        }
        return chain.reverse();
    }, [employeeById, focusEmployee, focusId]);

    const handleFocusChange = (nextId) => {
        if (!nextId) return;
        setFocusId(nextId);
        router.replace(`/erp/hrms/employees/hierarchy?focus=${encodeURIComponent(nextId)}`);
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Hierarchy Tree</h2>
                        <div className="text-sm text-muted-foreground">Role, department, and reporting structure.</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={load} disabled={loading}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                    {focusId ? (
                        <Button onClick={() => router.push(`/erp/hrms/employees/${focusId}`)} disabled={!focusId}>
                            Open Profile
                        </Button>
                    ) : null}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Focus employee</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Search</div>
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, id, role, department..." />
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Employee</div>
                        <Select value={focusId} onValueChange={handleFocusChange} disabled={loading || employees.length === 0}>
                            <SelectTrigger>
                                <SelectValue placeholder={loading ? 'Loading...' : 'Select employee'} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredEmployees.map((e) => (
                                    <SelectItem key={e.id} value={e.id}>
                                        {fullName(e)} ({e.id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Upper hierarchy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {!focusEmployee ? (
                            <div className="text-sm text-muted-foreground">Select an employee to view hierarchy.</div>
                        ) : managerChain.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No manager assigned.</div>
                        ) : (
                            managerChain.map((m) => (
                                <EmployeeCard key={m.id} employee={m} isFocus={m.id === focusId} onClick={() => handleFocusChange(m.id)} />
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Team tree</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!focusEmployee ? (
                            <div className="text-sm text-muted-foreground">Select an employee to view hierarchy.</div>
                        ) : (
                            <div className="overflow-x-auto py-4">
                                <div className="min-w-[720px]">
                                    <TreeNode
                                        employeeId={focusEmployee.id}
                                        focusId={focusId}
                                        employeeById={employeeById}
                                        reportsByManager={reportsByManager}
                                        visited={new Set()}
                                        depth={0}
                                        onFocusChange={handleFocusChange}
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

