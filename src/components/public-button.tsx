import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicButtonProps = ButtonProps;

export function PublicButton({ className, ...props }: PublicButtonProps) {
  return (
    <Button
      className={cn(
        "hover-btn-primary rounded-sm font-bold uppercase tracking-wider shadow-glow",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      {...props}
    />
  );
}
