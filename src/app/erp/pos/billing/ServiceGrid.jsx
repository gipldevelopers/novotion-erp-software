'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePosStore } from '@/stores/posStore';
import { Clock, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServiceGrid({ services, viewMode = 'grid' }) {
    const addToCart = usePosStore((state) => state.addToCart);

    if (viewMode === 'list') {
        return (
            <div className="space-y-2">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        className="cursor-pointer hover:border-primary/50 transition-all bg-card border-border"
                        onClick={() => addToCart(service)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-foreground truncate">{service.name}</h3>
                                        <Badge variant="secondary" className="text-[10px] shrink-0">
                                            {service.type}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{service.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {service.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            SAC: {service.sacCode}
                                        </span>
                                        <span>Tax: {service.taxRate}%</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-foreground">₹{service.price.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">{service.sku}</div>
                                    </div>
                                    <Button size="sm" className="shrink-0">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
                <Card
                    key={service.id}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group bg-card border-border"
                    onClick={() => addToCart(service)}
                >
                    <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex justify-between items-start gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1 truncate">
                                    {service.name}
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono">{service.sku}</p>
                            </div>
                            <Badge variant="secondary" className="text-[10px] shrink-0">
                                {service.type}
                            </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
                            {service.description}
                        </p>

                        <div className="space-y-2 pt-3 border-t border-dashed border-border">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {service.duration}
                                </span>
                                <span className="text-muted-foreground">Tax: {service.taxRate}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Tag className="h-3 w-3" />
                                    SAC: {service.sacCode}
                                </span>
                                <div className="text-lg font-bold text-foreground">
                                    ₹{service.price.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
