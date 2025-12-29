import React from "react";
import clsx from "clsx";

interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => (
  <table className="min-w-full divide-y divide-gray-200 dark:divide-white/[0.05]">
    {children}
  </table>
);

export const TableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <thead className={className}>{children}</thead>;

export const TableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <tbody className={className}>{children}</tbody>;

export const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <tr className={className}>{children}</tr>;

interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
  className?: string;
  colSpan?: number; // ✅ tambahkan ini
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className = "",
  colSpan,
}) =>
  isHeader ? (
    <th
      colSpan={colSpan}
      className={clsx(
        "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        className
      )}
    >
      {children}
    </th>
  ) : (
    <td
      colSpan={colSpan}
      className={clsx("px-4 py-3 text-sm text-gray-700 dark:text-gray-300", className)}
    >
      {children}
    </td>
  );
