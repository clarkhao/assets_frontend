//应用模块
import React, { lazy } from "react";
//style
import style from "./Profile.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件
const Frame = lazy(() => import("../component/layout/Frame"));
const ProfileComponent = lazy(() => import("../component/composite/Profile"));
//hooks
import { useStore } from "../store";
import Private from "../component/layout/Private";
import ErrorBoundary from "../component/ui/ErrorBoundary";

function Profile() {
  const themeMode = useStore((state) => state.themeMode);
  return (
    <div className={`${themeMode}-container`}>
      <ErrorBoundary>
        <Private>
          <ProfileComponent />
        </Private>
      </ErrorBoundary>
    </div>
  );
}

export default Profile;
