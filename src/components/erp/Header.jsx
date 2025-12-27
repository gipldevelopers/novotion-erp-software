// Updated: 2025-12-27
import { Bell, Search, Moon, Sun, Palette, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { useThemeStore } from '@/stores/themeStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useState } from 'react';
import { ThemeCustomizer } from './ThemeCustomizer';
export const Header = () => {
    const { mode, setMode } = useThemeStore();
    const { toggleMobile } = useSidebarStore();
    const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
    const notifications = [
        { id: 1, title: 'New invoice created', time: '5 min ago' },
        { id: 2, title: 'Payment received', time: '1 hour ago' },
        { id: 3, title: 'New lead assigned', time: '2 hours ago' },
    ];
    return (<>
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobile}>
            <Menu className="h-5 w-5"/>
          </Button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Search anything..." className="w-80 pl-10 bg-muted/50"/>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Mode Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {mode === 'dark' ? (<Moon className="h-5 w-5"/>) : (<Sun className="h-5 w-5"/>)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setMode('light')}>
                <Sun className="h-4 w-4 mr-2"/>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode('dark')}>
                <Moon className="h-4 w-4 mr-2"/>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode('system')}>
                <span className="mr-2">💻</span>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Customizer */}
          <Button variant="ghost" size="icon" onClick={() => setShowThemeCustomizer(true)}>
            <Palette className="h-5 w-5"/>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5"/>
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (<DropdownMenuItem key={notification.id} className="flex flex-col items-start py-3">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </DropdownMenuItem>))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ThemeCustomizer open={showThemeCustomizer} onOpenChange={setShowThemeCustomizer}/>
    </>);
};
