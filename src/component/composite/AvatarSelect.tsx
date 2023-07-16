//应用
import React, { useRef } from "react";
import { AuthConfig, sdk } from "../utils";
import { TOKEN, URL_HOME } from "../utils/config";
//style
import style from "./Avatar.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import Avatar from "../ui/Avatar";
import Menu from "../ui/Menu";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useStore, clearSession } from "../../store";
import axios from "axios";

type TAvatarSelect = {
  /**
   * size
   */
  size: number;
  /**
   * iconUrl
   */
  iconUrl: string;
  /**
   * is admin?
   */
  isAdmin: boolean;
  /**
   * offset
   */
  offset: { x: number; y: number };
  /**
   * i18n content
   */
  content: Record<string, string>;
};

function AvatarSelect({ size = 50, ...props }: TAvatarSelect) {
  const [click, setClick] = React.useState(false);
  const navigate =
    import.meta.env.MODE === "development" ? null : useNavigate();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClick(!click);
  };
  const [i18n, reset] = useStore((state) => [
    state.i18n,
    state.reset
  ]);
  const handleElement = (el: string) => {
    if (el === props.content.logout) {
      reset();
      clearSession();
      axios({
        url: `${AuthConfig.serverUrl}/api/logout`,
        method: "POST",
        data: {
          id_token_hint: TOKEN,
          post_logout_redirect_uri: URL_HOME,
          state: sdk.getOrSaveState(),
        },
      })
        .then((res) => {
          if (res.status === 302) {
            const redirectUrl = res.headers.location;
            window.location.href = redirectUrl;
          }
        })
        .catch((err) => {
          console.log((err as Error).message);
        });
    } else {
      window.location.href = `/${i18n}/${getTheKey(el, props.content)}`;
    }
    setClick(false);
  };
  React.useEffect(() => {
    const mouseHandler = (e: MouseEvent) => {
      const dropdown = document.querySelector("#avatar-menu");
      const button = document.querySelector("#avatar-icon") as Node;
      if (dropdown && !button.contains(e.target as Node)) {
        setClick(false);
      }
    };
    window.addEventListener("click", mouseHandler);
    return () => {
      window.removeEventListener("click", mouseHandler);
    };
  }, []);
  return (
    <>
      <Avatar
        id="avatar-icon"
        size={size}
        handleClick={handleClick}
        iconUrl={props.iconUrl}
      >
        <Menu
          id="avatar-menu"
          isShown={click}
          handleElement={handleElement}
          content={
            props.isAdmin
              ? [
                  props.content.profile,
                  props.content.account,
                  props.content.logout,
                ]
              : [props.content.profile, props.content.logout]
          }
          offsetX={props.offset?.x ?? -size / 2}
          offsetY={props.offset?.y ?? 0}
        />
      </Avatar>
    </>
  );
}

function getTheKey(value: string, record: Record<string, string>) {
  let result = "";
  for (const key in record) {
    if (value === record[key]) result = key;
  }
  return result;
}

export default AvatarSelect;
