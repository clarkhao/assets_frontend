//应用
import React, { useRef } from "react";
//style
import style from "./Follower.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import IconButton from "@mui/material/IconButton";
import {FiHeart} from "react-icons/fi";
//hooks
import { useStore } from "../../store";

type TFollower = {
  /**
   * size
   */
  size: number;
  /**
   * value
   */
  data: {name: string; value: number;}
  /**
   * icon
   */
  icon: React.ReactNode;
  /**
   * click handler
   */
  onClick?: () => void;
};

function Follower({ size=100, icon=<FiHeart />, ...props }: TFollower) {
  const themeMode = useStore((state) => state.themeMode);
  return (
    <div className={[style.container, `${themeMode}-container`].join(" ")} onClick={props.onClick}>
        <IconButton>{icon}</IconButton>
        <div className={style.icon} css={css`
        --follower-icon-size: ${size}px;
        `}>
          <div>{props.data?.value}</div>
          <p>{props.data?.name}</p>
        </div>
    </div>
  );
}

export default Follower;
