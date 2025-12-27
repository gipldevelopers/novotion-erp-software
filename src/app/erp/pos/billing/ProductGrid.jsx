'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePosStore } from '@/stores/posStore';
import { Plus, Clock, FileText } from 'lucide-react';

export default function ProductGrid({ products }) {
    const addToCart = usePosStore((state) => state.addToCart);

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3 py-20">
                <div className="p-4 bg-muted/50 rounded-full">
                    <FileText className="h-8 w-8 opacity-40" />
                </div>
                <p className="text-lg font-medium">No services match your search.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {products.map((service) => (
                <Card
                    key={service.id}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 border-border group bg-card"
                    onClick={() => addToCart(service)}
                >
                    <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                        <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors">{service.name}</h3>
                                <p className="text-xs text-muted-foreground font-mono">{service.sku}</p>
                            </div>
                            <Badge variant="secondary" className="font-normal text-[10px] shrink-0">
                                {service.type}
                            </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5em]">
                            {service.description}
                        </div>

                        <div className="flex items-end justify-between pt-3 border-t border-dashed border-border">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {service.duration}
                            </div>
                            <div className="text-base font-bold text-foreground">
                                ₹{service.price}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
