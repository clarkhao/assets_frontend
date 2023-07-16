import React, { Component, ErrorInfo, Fragment, ReactNode } from "react";
import BackHome from "../composite/BackHome";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  msg: string;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      msg: "",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, msg: error.message });
  }

  componentWillUnmount(): void {}

  render() {
    if (this.state.hasError) {
      return (
        <Fragment>
          {(() => {
            switch (this.state.msg) {
              case "authenticate failed":
                return (
                  <BackHome
                    error="401 - Not Login Yet"
                    reason="Please Login in."
                    isLogin={true}
                  />
                );
                break;
              case "authorize failed":
                return (
                  <BackHome
                    error="403 - Not Authorized"
                    reason="Please Upgrade Your Account."
                    isLogin={false}
                  />
                );
                break;

              default:
                return (
                  <BackHome
                    error="404 - Page Not Found"
                    reason="The page you are looking for does not exist."
                  />
                );
                break;
            }
          })()}
        </Fragment>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
