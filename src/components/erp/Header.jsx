import { Bell, Search, Moon, Sun, Palette, Menu, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { useThemeStore } from '@/stores/themeStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import Link from 'next/link';
import { ThemeCustomizer } from './ThemeCustomizer';
export const Header = () => {
  const { user, logout } = useAuthStore();
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
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search anything..." className="w-80 pl-10 bg-muted/50" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Mode Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {mode === 'dark' ? (<Moon className="h-5 w-5" />) : (<Sun className="h-5 w-5" />)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setMode('light')}>
              <Sun className="h-4 w-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode('dark')}>
              <Moon className="h-4 w-4 mr-2" />
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
          <Palette className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
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

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-border hover:border-primary/50 transition-colors">
              <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/erp/profile" className="cursor-pointer w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/erp/admin/settings" className="cursor-pointer w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <ThemeCustomizer open={showThemeCustomizer} onOpenChange={setShowThemeCustomizer} />
  </>);
};
