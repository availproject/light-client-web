import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const { resolvedTheme } = useTheme();
  const [backgroundColor, setBackgroundColor] = React.useState('#949596');

  React.useEffect(() => {
    if (resolvedTheme === 'dark') {
      setBackgroundColor('#949596'); 
    } else {
      setBackgroundColor('#000000'); 
    }
  }, [resolvedTheme]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-4 w-full overflow-hidden rounded-full', className)}
      style={{ backgroundColor }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-[#3CBBF9] transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
