//应用
import React, { useRef } from "react";
import { sdk } from "../utils";
//style
import style from "./BackHome.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";
//组件
//hooks
import { useStore } from "../../store";
import { getDictionary } from "../../i18n";

interface IBackHome {
  /**
   * error type
   */
  error: string;
  /**
   * error reason
   */
  reason: string;
  /**
   * is login button existed?
   */
  isLogin?: boolean;
}

function BackHome({
  error = "404 - Page Not Found",
  reason = "The page you are looking for does not exist.",
  ...props
}: IBackHome) {
  const [themeMode, i18n] = useStore((state) => [state.themeMode, state.i18n]);
  const content = getDictionary(i18n as "jp" | "en" | "cn").backhome as Record<
    string,
    any
  >;
  const handleClick = () => {
    const url = sdk.getSigninUrl();
    window.location.href = url;
  };
  return (
    <div className={[style.backhome, `${themeMode}-container`].join(" ")}>
      <h1>{content.error}</h1>
      <p>{content.reason}</p>
      <div className={style.buttons}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          {content.next}
        </Button>
        {props.isLogin && (
          <Button
            variant="contained"
            color="success"
            style={{ width: "160px" }}
            onClick={handleClick}
          >
            {content.login}
          </Button>
        )}
      </div>
    </div>
  );
}

export default BackHome;
