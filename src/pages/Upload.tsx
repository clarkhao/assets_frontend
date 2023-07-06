/** @jsxImportSource @emotion/react */
//应用模块
import React, { lazy } from "react";
//style
import style from "./Upload.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件
import Logo from "../component/ui/Logo";
const Uploader = lazy(() => import("../component/composite/Uploader"));
const Frame = lazy(() => import("../component/layout/Frame"));
import Private from "../component/layout/Private";
import ErrorBoundary from "../component/ui/ErrorBoundary";

function Upload() {
  const theme = useTheme();

  return (
    <div
      className={[
        style.container,
        theme.palette.mode === "dark" ? style.dark : "",
      ].join(" ")}
    >
      <ErrorBoundary>
        <Private>
          <Uploader />
        </Private>
      </ErrorBoundary>
    </div>
  );
}

export default Upload;
