// A React Error Boundary component that catches JavaScript errors in its child component tree.
// When an error is caught, it renders a fallback UI, which by default is the ErrorComponent

"use client";

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to display the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback UI if provided
      return (
        this.props.fallback || (
          <div className="text-center mt-20 text-red-500">
            Error: {this.state.error?.message}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
