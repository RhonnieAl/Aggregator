import React from "react";
import clsx from "clsx";

const TableRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, forwardedRef) => (
  <div ref={forwardedRef}>
    <div
      // Make table scrollable on mobile
      className={clsx("w-full overflow-auto", className)}
      {...props}>
      {children}
    </div>
  </div>
));

TableRoot.displayName = "TableRoot";

const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, forwardedRef) => (
  <table
    ref={forwardedRef}
    className={clsx(
      // Base styles
      "w-full text-sm text-left text-gray-500 dark:text-gray-400",
      // Enable collapsed borders
      "border-collapse border border-gray-200 dark:border-gray-700",
      className
    )}
    {...props}
  />
));

Table.displayName = "Table";

const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, forwardedRef) => (
  <thead
    ref={forwardedRef}
    className={clsx(
      // Add background color to the header
      "bg-gray-50 dark:bg-gray-800",
      className
    )}
    {...props}
  />
));

TableHead.displayName = "TableHead";

const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, forwardedRef) => (
  <th
    ref={forwardedRef}
    className={clsx(
      // Base styles with borders
      "border border-gray-200 dark:border-gray-700 px-4 py-3.5 text-left text-base font-semibold",
      // Text color
      "text-gray-900 dark:text-gray-50",
      className
    )}
    {...props}
  />
));

TableHeaderCell.displayName = "TableHeaderCell";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, forwardedRef) => (
  <tbody ref={forwardedRef} className={clsx(className)} {...props} />
));

TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, forwardedRef) => (
  <tr
    ref={forwardedRef}
    className={clsx(
      // Hover effect for rows
      "hover:bg-gray-100 dark:hover:bg-gray-700",
      className
    )}
    {...props}
  />
));

TableRow.displayName = "TableRow";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, forwardedRef) => (
  <td
    ref={forwardedRef}
    className={clsx(
      // Base styles with borders
      "p-4 text-base border border-gray-200 dark:border-gray-700",
      // Text color
      "text-gray-600 dark:text-gray-400",
      className
    )}
    {...props}
  />
));

TableCell.displayName = "TableCell";

const TableFoot = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, forwardedRef) => (
  <tfoot
    ref={forwardedRef}
    className={clsx(
      // Base styles with borders
      "border-t border-gray-200 dark:border-gray-700 text-left font-medium",
      // Text color
      "text-gray-900 dark:text-gray-50",
      className
    )}
    {...props}
  />
));

TableFoot.displayName = "TableFoot";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, forwardedRef) => (
  <caption
    ref={forwardedRef}
    className={clsx(
      // Base styles
      "mt-3 px-3 text-center text-sm",
      // Text color
      "text-gray-500 dark:text-gray-500",
      className
    )}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow
};
