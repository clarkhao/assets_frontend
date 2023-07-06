//应用
import React, { Fragment } from "react";
import { useStore } from "../../store";
//style
import style from "./Private.module.css";
import { lightTheme, darkTheme } from "../utils";
//组件

type TPrivate = {
  /**
   * children
   */
  children: React.ReactNode;
};

function Private({ ...props }: TPrivate) {
  const [isAuth, setAuth] = useStore((state) => [state.isAuth, state.setAuth]);
  const user = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("token");
  const pulibcToken = sessionStorage.getItem("publicToken");
  if (!isAuth || !user || !token || !pulibcToken) {
    setAuth(false);
    throw new Error("authenticate failed");
  }
  return <Fragment>{(isAuth && user && token && pulibcToken) ? props.children : null}</Fragment>;
}

export default Private;
