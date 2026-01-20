import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>
              <i className="fas fa-exclamation-triangle me-2"></i>
              Something went wrong
            </Alert.Heading>
            <p>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-3">
                <summary>Error details (development only)</summary>
                <pre className="mt-2 small text-muted">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <hr />
            <div className="d-flex gap-2">
              <Button variant="outline-danger" onClick={this.handleReload}>
                <i className="fas fa-redo me-1"></i>
                Reload Page
              </Button>
              <Button variant="outline-secondary" onClick={() => window.history.back()}>
                <i className="fas fa-arrow-left me-1"></i>
                Go Back
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;