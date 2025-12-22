import { cn } from "@/lib/utils";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export const AnimatedLink = ({
  href,
  children,
  className,
  external = true,
}: AnimatedLinkProps) => {
  return (
    <a
      href={href}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      className={cn(
        "relative inline-flex items-center text-[#E53935]",
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0",
        "before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0",
        "before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100",
        className
      )}
    >
      {children}
    </a>
  );
};
