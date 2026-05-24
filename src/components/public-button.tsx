import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicButtonProps = ButtonProps;

const primaryClasses =
  "hover-btn-primary rounded-sm font-bold uppercase tracking-wider shadow-glow bg-primary text-primary-foreground hover:bg-primary/90";

const outlineClasses =
  "hover-btn-outline rounded-sm font-bold uppercase tracking-wider border border-border bg-background hover:bg-secondary";

export function PublicButton({ className, asChild, ...props }: PublicButtonProps) {
  return <Button asChild={asChild} className={cn(primaryClasses, className)} {...props} />;
}

export function PublicOutlineButton({ className, asChild, ...props }: PublicButtonProps) {
  return <Button asChild={asChild} variant="outline" className={cn(outlineClasses, className)} {...props} />;
}
