import { useState } from 'react';
import { Search, Plus, Minus, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
const mockProducts = [
    { id: '1', name: 'Laptop Pro 15"', price: 1299, category: 'Electronics' },
    { id: '2', name: 'Wireless Mouse', price: 49, category: 'Electronics' },
    { id: '3', name: 'USB-C Hub', price: 79, category: 'Electronics' },
    { id: '4', name: 'Monitor 27"', price: 399, category: 'Electronics' },
    { id: '5', name: 'Keyboard', price: 129, category: 'Electronics' },
    { id: '6', name: 'Headphones', price: 199, category: 'Electronics' },
];
export const BillingPage = () => {
    const { toast } = useToast();
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing)
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...product, quantity: 1 }];
        });
    };
    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
    };
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const handleCheckout = () => {
        toast({ title: 'Payment Successful', description: `Total: $${total.toFixed(2)}` });
        setCart([]);
    };
    const filteredProducts = mockProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    return (<div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in">
      {/* Products */}
      <div className="flex-1 flex flex-col">
        <div className="page-header mb-4"><h1 className="page-title">POS Billing</h1></div>
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10"/></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-auto flex-1">
          {filteredProducts.map(product => (<Card key={product.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => addToCart(product)}>
              <CardContent className="p-4"><p className="font-medium truncate">{product.name}</p><p className="text-lg font-bold text-primary">${product.price}</p></CardContent>
            </Card>))}
        </div>
      </div>

      {/* Cart */}
      <Card className="w-96 flex flex-col">
        <CardHeader><CardTitle>Current Order</CardTitle></CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto space-y-3">
            {cart.length === 0 ? <p className="text-muted-foreground text-center py-8">No items in cart</p> : cart.map(item => (<div key={item.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0"><p className="font-medium truncate">{item.name}</p><p className="text-sm text-muted-foreground">${item.price} × {item.quantity}</p></div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-3 w-3"/></Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-3 w-3"/></Button>
                </div>
              </div>))}
          </div>
          <Separator className="my-4"/>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Button variant="outline" className="flex-col h-16" disabled={cart.length === 0}><Banknote className="h-5 w-5 mb-1"/><span className="text-xs">Cash</span></Button>
            <Button variant="outline" className="flex-col h-16" disabled={cart.length === 0}><CreditCard className="h-5 w-5 mb-1"/><span className="text-xs">Card</span></Button>
            <Button variant="outline" className="flex-col h-16" disabled={cart.length === 0}><Smartphone className="h-5 w-5 mb-1"/><span className="text-xs">Mobile</span></Button>
          </div>
          <Button className="mt-4" size="lg" onClick={handleCheckout} disabled={cart.length === 0}>Complete Payment</Button>
        </CardContent>
      </Card>
    </div>);
};
