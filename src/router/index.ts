import React, { Ref } from "react";
import {
  LoaderFunction,
  ActionFunction,
  createBrowserRouter,
} from "react-router-dom";

interface IRoute {
  path: string;
  Element: JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: JSX.Element;
  name: string;
  nodeRef: React.RefObject<HTMLDivElement>;
}
const locales = ["en", "cn", "jp"];
const pages = import.meta.glob("../pages/**/*.tsx", { eager: true });
const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  locales.forEach((el) => {
    routes.push({
      path:
        fileName === "index"
          ? `/${el}`
          : fileName === "Callback"
          ? `/callback`
          : `/${el}/${normalizedPathName.toLowerCase()}`,
      // @ts-ignore
      Element: pages[path].default,
      // @ts-ignore
      loader: pages[path]?.loader as unknown as LoaderFunction | undefined,
      // @ts-ignore
      action: pages[path]?.action as unknown as ActionFunction | undefined,
      // @ts-ignore
      ErrorBoundary: pages[path]?.ErrorBoundary as unknown as JSX.Element,
      name: fileName,
      nodeRef: React.createRef(),
    });
  });
}

export default routes;
