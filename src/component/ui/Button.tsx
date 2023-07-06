//应用
import React, { Fragment, useRef } from "react";
//style
import style from "./Button.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import { FiPlusCircle } from "react-icons/fi";

type TButton = {
  /**
   * handleClick
   */
  handleClick: () => void; 
}

function JumpButton({...props}: TButton) {
  return <div className={style.button} onClick={props.handleClick}>
    <FiPlusCircle />
  </div>
}

export default JumpButton;