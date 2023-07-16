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
  const [isAuth, setAuth, token] = useStore((state) => [state.isAuth, state.setAuth, state.token]);
  const user = sessionStorage.getItem("user");
  
  if (!isAuth || !user || !token) {
    setAuth(false);
    throw new Error("authenticate failed");
  }
  return <Fragment>{(isAuth && user && token) ? props.children : null}</Fragment>;
}

export default Private;
