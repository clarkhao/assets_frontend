//应用
import React from "react";
import { useStore, clearSession } from "../../store";
//style
import style from "./TopBar.module.css";
//组件
import AvatarSelect from "../composite/AvatarSelect";
import Button from "@mui/material/Button";
import { getDictionary } from "../../i18n";

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
  const [i18n] = useStore((state) => [state.i18n]);
  
  const topbar = getDictionary(i18n as 'jp' | 'en' | 'cn').topbar as Record<string, string>;
  return (
    <div className={style.container}>
      <div className={[style.logo, "topbar-logo"].join(" ")}>{props.left}</div>
      <div className={[style.right, "topbar-right"].join(" ")}>
        {props.rightOne}
        {props.rightTwo}
        {props.isAuth ? (
          <AvatarSelect
            size={40}
            iconUrl={iconUrl}
            isAdmin={roles.some(el => el === "admin" || el === "root")}
            offset={{ x: -40, y: 21 }}
            content={topbar}
          />
        ) : (
          <Button onClick={props.handleClick}>{topbar.signin}</Button>
        )}
      </div>
      <div className={style.bar}></div>
    </div>
  );
}

export default TopBar;
