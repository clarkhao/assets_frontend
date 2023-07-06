//应用模块
import React, { lazy } from "react";
//style
import style from "./Account.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
import Private from "../component/layout/Private";
import ErrorBoundary from "../component/ui/ErrorBoundary";
//组件
const Frame = lazy(() => import("../component/layout/Frame"));
const Table = lazy(() => import("../component/ui/Table"));
//hooks
import { useStore } from "../store";
import Authroize from "../component/layout/Authorize";

function Account() {
  const themeMode = useStore((state) => state.themeMode);
  return (
    <div className={[style.container, `${themeMode}-container`].join(" ")}>
      <ErrorBoundary>
        <Private>
          <Authroize>
            <Table />
          </Authroize>
        </Private>
      </ErrorBoundary>
    </div>
  );
}

export default Account;
