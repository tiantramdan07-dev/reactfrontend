import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full px-3 py-2 border rounded-lg outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 ${className}`}
      />
    );
  }
);

export default Input;
