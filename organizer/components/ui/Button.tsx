import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Note: Radix UI slot is optional but good for composition. 
// For now, I'll stick to a simpler implementation without heavy dependencies effectively mimicking shadcn/ui but lighter if radix isn't installed.
// Wait, I didn't install class-variance-authority or radix-ui/react-slot.
// I should probably simplify this to just props or install them. 
// Let's implement a simple version first to avoid extra installs for now, or just install them.
// "Modern and Refined" suggests sticking to standards. I'll use simple props for now to be fast.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
            ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
            danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-lg",
            icon: "h-10 w-10",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
