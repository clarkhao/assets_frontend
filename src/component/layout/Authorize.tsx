//应用
import React, { Fragment } from "react";
import { useStore } from "../../store";
//style
import style from "./Private.module.css";
import { lightTheme, darkTheme } from "../utils";
//组件

interface IAuthorize {
  /**
   * children
   */
  children: React.ReactNode;
}

function Authroize({ ...props }: IAuthorize) {
  const user = sessionStorage.getItem("user");
  if (user === null) throw new Error("authenticate failed");
  const roles = JSON.parse(user).role as Array<string>;
  const authorized = roles.some((el) => el === "admin" || el === "root");
  if (!authorized) throw new Error("authorize failed");

  return <Fragment>{authorized ? props.children : null}</Fragment>;
}

export default Authroize;
