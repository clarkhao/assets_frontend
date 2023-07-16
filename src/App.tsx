import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { useStore } from "./store";
import { Fragment } from "react";
import { generateTheme } from "./component/utils";
import routes from "./router";
//style
//组件
import Frame from "./component/layout/Frame";
import ErrorBoundary from "./component/ui/ErrorBoundary";
import BackHome from "./component/composite/BackHome";

const App = () => {
  const mode = useStore((state) => state.themeMode);
  const theme = generateTheme(mode);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Frame />,
      children: routes.map(({ Element, ErrorBoundary, ...rest }) => ({
        ...rest,
        index: rest.path === "/",
        path: rest.path === "/" ? undefined : rest.path,
        // @ts-ignore
        element: <Element />,
      })),
      errorElement: (
        <BackHome
          error="404 - Page Not Found"
          reason="The page you are looking for does not exist."
        />
      ),
    },
  ]);

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
