//应用
import React, { useRef } from "react";
//style
import style from "./Popup.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import Button from "@mui/material/Button";
import { FiXCircle } from "react-icons/fi";

type TPopup = {
  /**
   * children
   */
  children?: React.ReactNode;
  /**
   * appear
   */
  appear?: boolean;
}

function Popup({...props}: TPopup) {
  const [disappear, setDisappear] = React.useState(props.appear ?? false);
  const handleClick = () => {
    setDisappear(true);
  }
  return <div className={[style.popup, disappear ? style.disappear : ""].join(" ")}>
    <FiXCircle onClick={handleClick}/>
    {props.children}
    <div className={style.popup_btn}>
      <Button variant="contained" color="primary">确定</Button>
      <Button variant="contained" color="primary" onClick={handleClick}>取消</Button>
    </div>
  </div>
}

export default Popup;