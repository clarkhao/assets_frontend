//应用
import React, { Fragment } from "react";
import { useStore } from "../../store";
//style
import style from "./Spin.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";

type TSpin = {
  /**
   * size of single circle
   */
  size: number;
}

function Spin({...props}: TSpin) {
  return <div className={style.container} css={
    css`--spin-size: ${props.size}px;`
  }>
    {(new Array(4)).fill(0).map((_, i) => <div key={`spin_${i}`} className={style.spin}></div>)}
  </div>
}

export default Spin;