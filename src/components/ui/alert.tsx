import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { AlertProps, AlertDescriptionProps } from "./types";

const Alert = forwardRef<HTMLDivElement, AlertProps>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-background text-foreground",
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));

Alert.displayName = "Alert";
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
