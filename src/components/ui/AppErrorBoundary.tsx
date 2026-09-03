import { Component, type PropsWithChildren } from "react";
import { ErrorState } from "./ErrorState";

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<
  PropsWithChildren,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Something went wrong"
          description="This view could not be displayed. Try loading it again."
          onRetry={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}
