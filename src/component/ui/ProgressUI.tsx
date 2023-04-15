//应用
import React from "react";
//style
import style from "./ProgressUI.module.css";
//组件
import LinearProgress from "@mui/material/LinearProgress";

export type ProgressType = {
  /**
   * value from 0 to 100 when status is determinate
   */
  value: number;
  /**
   * text show file name
   */
  text: string;
};
function Progress({ value, ...props }: ProgressType) {
  return (
    <div className={style.container}>
      <div className={style.top}>
        <p>{props.text}</p>
        <p>{`${value}%`}</p>
      </div>
      {value > 0 ? (
        <LinearProgress color="primary" value={value} variant="determinate" />
      ) : (
        <LinearProgress color="primary" />
      )}
    </div>
  );
}

export default Progress;
