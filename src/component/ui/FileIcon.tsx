/** @jsxImportSource @emotion/react */
//应用
import React from "react";
import { iconLibrary } from "../utils";
//style
import style from "./FileIcon.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件

type TFileIcon = {
  /**
   * file type
   */
  type: string;
  /**
   * size
   */
  size: number;
};

function FileIcon({ size = 200, ...props }: TFileIcon) {
  const colors = ["RoyalBlue", "orange", "SeaGreen", "brown", "grey"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <div
      className={style.container}
      css={css`
        --file-icon-size: ${size}px;
        --file-icon-color: ${color};
      `}
    >
      {iconLibrary.get("file")}
      <div className={style.type}>{props.type ?? 'svg'}</div>
    </div>
  );
}

export default FileIcon;