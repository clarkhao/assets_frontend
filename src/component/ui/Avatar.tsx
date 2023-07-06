//应用
import React, { useRef } from "react";
//style
import style from "./Avatar.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import IconButton from "@mui/material/IconButton";
import Skeleton from "./Skeleton";

type TAvatar = {
  /**
   * size
   */
  size: number;
  /**
   * children
   */
  children?: React.ReactNode;
  /**
   * handleClick?
   */
  handleClick?: (e: React.MouseEvent) => void;
  /**
   * id
   */
  id?: string;
  /**
   * url for avatar
   */
  iconUrl?: string;
};

function Avatar({ size = 100, ...props }: TAvatar) {
  return (
    <IconButton
      color="error"
      aria-label="avatar"
      onClick={props.handleClick}
      id={props.id}
      className={style.container}
    >
      {props.iconUrl ? (
        <div
          css={css`
            --avatar-icon-size: ${size}px;
            --avatar-icon-image: url(${props.iconUrl});
          `}
        >
          {props.children}
        </div>
      ) : (
        <Skeleton
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `50%`,
          }}
        />
      )}
    </IconButton>
  );
}

export default Avatar;
