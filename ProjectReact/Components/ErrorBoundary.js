import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error or send it to a logging service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render an error message or component here
      return <div>Something went wrong. Please try again later.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

