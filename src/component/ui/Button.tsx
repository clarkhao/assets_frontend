//应用
import React, { Fragment, useRef } from "react";
//style
import style from "./Button.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import { FiPlusCircle } from "react-icons/fi";
import { useStore } from "../../store";

type TButton = {
  /**
   * handleClick
   */
  handleClick: () => void;
};

function JumpButton({ ...props }: TButton) {
  const [i18n] = useStore((state) => [state.i18n]);

  return (
    <div
      className={[
        style.button,
        i18n === "en"
          ? style.enbutton
          : i18n === "cn"
          ? style.cnbutton
          : style.jpbutton,
      ].join(" ")}
      onClick={props.handleClick}
    >
      <FiPlusCircle />
    </div>
  );
}

export default JumpButton;
