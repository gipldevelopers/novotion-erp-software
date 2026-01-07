// Updated: 2025-12-27
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useThemeStore } from '@/stores/themeStore';
import { RotateCcw } from 'lucide-react';
const colorPresets = [
    { name: 'Blue', value: '221 83% 53%' },
    { name: 'Green', value: '142 76% 36%' },
    { name: 'Purple', value: '262 83% 58%' },
    { name: 'Orange', value: '24 95% 53%' },
    { name: 'Red', value: '0 84% 60%' },
    { name: 'Teal', value: '172 66% 50%' },
    { name: 'Pink', value: '330 81% 60%' },
    { name: 'Indigo', value: '234 89% 54%' },
];
const sidebarPresets = [
    { name: 'Dark', value: '222 47% 11%' },
    { name: 'Darker', value: '222 47% 6%' },
    { name: 'Navy', value: '231 48% 18%' },
    { name: 'Slate', value: '215 28% 17%' },
    { name: 'Charcoal', value: '240 10% 14%' },
];
export const ThemeCustomizer = ({ open, onOpenChange }) => {
    const { config, setConfig, resetConfig } = useThemeStore();
    const [localConfig, setLocalConfig] = useState(config);
    const handleApply = () => {
        setConfig(localConfig);
        onOpenChange(false);
    };
    const handleReset = () => {
        resetConfig();
        setLocalConfig({
            primaryColor: '221 83% 53%',
            secondaryColor: '215 20% 95%',
            sidebarColor: '222 47% 11%',
            borderRadius: 0.5,
            fontSize: 16,
        });
    };
    return (<Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Theme Customizer</SheetTitle>
          <SheetDescription>
            Customize the appearance of your ERP system
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Primary Color */}
          <div className="space-y-3">
            <Label>Primary Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((color) => (<button key={color.name} onClick={() => setLocalConfig({ ...localConfig, primaryColor: color.value })} className={`h-10 rounded-lg border-2 transition-all ${localConfig.primaryColor === color.value
                ? 'border-foreground scale-110'
                : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: `hsl(${color.value})` }} title={color.name}/>))}
            </div>
          </div>

          {/* Sidebar Color */}
          <div className="space-y-3">
            <Label>Sidebar Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {sidebarPresets.map((color) => (<button key={color.name} onClick={() => setLocalConfig({ ...localConfig, sidebarColor: color.value })} className={`h-10 rounded-lg border-2 transition-all ${localConfig.sidebarColor === color.value
                ? 'border-primary scale-110'
                : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: `hsl(${color.value})` }} title={color.name}/>))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Border Radius</Label>
              <span className="text-sm text-muted-foreground">
                {localConfig.borderRadius}rem
              </span>
            </div>
            <Slider value={[localConfig.borderRadius]} onValueChange={([value]) => setLocalConfig({ ...localConfig, borderRadius: value })} min={0} max={1.5} step={0.125} className="w-full"/>
            <div className="flex gap-2 mt-2">
              {[
            { radius: 0.25, label: 'sm', preview: 'rounded-sm' },
            { radius: 0.5, label: 'md', preview: 'rounded-md' },
            { radius: 0.75, label: 'lg', preview: 'rounded-lg' },
            { radius: 1, label: 'xl', preview: 'rounded-xl' },
        ].map(({ radius, label }) => (<button key={label} onClick={() => setLocalConfig({ ...localConfig, borderRadius: radius })} className={`flex-1 h-10 border-2 transition-all ${localConfig.borderRadius === radius
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'}`} style={{ borderRadius: `${radius}rem` }}>
                  {label}
                </button>))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Font Size</Label>
              <span className="text-sm text-muted-foreground">
                {localConfig.fontSize}px
              </span>
            </div>
            <Slider value={[localConfig.fontSize]} onValueChange={([value]) => setLocalConfig({ ...localConfig, fontSize: value })} min={12} max={20} step={1} className="w-full"/>
          </div>

          {/* Preview Card */}
          <div className="space-y-3">
            <Label>Preview</Label>
            <div className="p-4 border border-border" style={{
            borderRadius: `${localConfig.borderRadius}rem`,
            fontSize: `${localConfig.fontSize}px`,
        }}>
              <div className="px-4 py-2 text-center font-medium text-white mb-3" style={{
            backgroundColor: `hsl(${localConfig.primaryColor})`,
            borderRadius: `${localConfig.borderRadius * 0.75}rem`,
        }}>
                Primary Button
              </div>
              <p className="text-muted-foreground text-sm">
                This is how your theme will look across the application.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2"/>
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Theme
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>);
};
