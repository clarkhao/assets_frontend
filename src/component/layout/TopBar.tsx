//应用
import React from "react";
import { useStore, clearSession } from "../../store";
//style
import style from "./TopBar.module.css";
//组件
import AvatarSelect from "../ui/AvatarSelect";
import Button from "@mui/material/Button";

type TTopBar = {
  /**
   * handler for click button to handle the login/signup process
   */
  handleClick?: (e: React.MouseEvent) => void;
  /**
   * is auth?
   */
  isAuth: boolean;
  /**
   * left
   */
  left: React.ReactNode;
  /**
   * right one
   */
  rightOne: React.ReactNode;
  /**
   * right two
   */
  rightTwo: React.ReactNode;
};

function TopBar({ ...props }: TTopBar) {
  const user = sessionStorage.getItem("user");
  const iconUrl = user ? JSON.parse(user).avatar : "/avatar.svg";
  const roles = user ? JSON.parse(user).role as Array<string>: [];

  return (
    <div className={style.container}>
      <div className={style.logo}>{props.left}</div>
      <div className={style.right}>
        {props.rightOne}
        {props.rightTwo}
        {props.isAuth ? (
          <AvatarSelect
            size={40}
            iconUrl={iconUrl}
            isAdmin={roles.some(el => el === "admin" || el === "root")}
            offset={{ x: -20, y: 21 }}
          />
        ) : (
          <Button onClick={props.handleClick}>Sign in</Button>
        )}
      </div>
      <div className={style.bar}></div>
    </div>
  );
}

export default TopBar;
