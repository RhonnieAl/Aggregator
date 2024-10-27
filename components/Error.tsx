// A reusable component that displays an error message. It takes a message prop and renders it in a styled manner.

import React from "react";

interface ErrorProps {
  message: string;
}

const ErrorComponent: React.FC<ErrorProps> = ({ message }) => {
  return <div className="text-center mt-20 text-red-500">Error: {message}</div>;
};

export default ErrorComponent;
