//应用
import React, { Fragment } from "react";
//style
import style from "./ThemeFrame.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//hooks
import { useStore } from "../../store";

type TThemeFrame = {
  /**
   * children
   */
  children: React.ReactNode;
  /**
   * classNames
   */
  classNames?: Array<string>;
};

function ThemeFrame({ ...props }: TThemeFrame) {
  const themeMode = useStore((state) => state.themeMode);
  return (
    <Fragment>
      <div className={[...props.classNames ?? "", `${themeMode}-container`].join(" ")}>
        {props.children}
      </div>
    </Fragment>
  );
}

export default ThemeFrame;
