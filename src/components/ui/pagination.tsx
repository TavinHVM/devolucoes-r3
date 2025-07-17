import * as React from "react"
import { cn } from "../../lib/utils"

export function Pagination({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex w-full justify-center", className)}
      {...props}
    >
      {children}
    </nav>
  )
}

export function PaginationContent({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex items-center gap-1", className)} {...props} />
}

export function PaginationItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />
}

export function PaginationLink({ className, isActive, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean }) {
  return (
    <a
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors",
        isActive && "bg-slate-700 text-white",
        className
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  )
}

export function PaginationPrevious({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors",
        className
      )}
      aria-label="Previous"
      {...props}
    >
      &lt;
    </a>
  )
}

export function PaginationNext({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors",
        className
      )}
      aria-label="Next"
      {...props}
    >
      &gt;
    </a>
  )
}
