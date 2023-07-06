//应用
import React, { useRef } from "react";
//style
import style from "./Logo.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import { FiPlusCircle } from "react-icons/fi";
import { set } from "zod";

type TLogo = {
  /**
   * size
   */
  size: number;
  /**
   * click handler
   */
  clickHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
};

function Logo({ size = 40, ...props }: TLogo) {
  const [rotateStart, setRotateStart] = React.useState(0);
  const [rotateEnd, setRotateEnd] = React.useState(0);
  const [timer, setTimer] = React.useState<number>(0);
  const [count, setCount] = React.useState(1);
  React.useEffect(() => {
    let throttle = false;
    const mouseHandler = (e: MouseEvent) => {
      if (throttle) return;
      setCount((prev) => prev + 1)
      setRotateEnd(e.clientX + e.clientY)
      throttle = true;
      setTimer(
        window.setTimeout(() => {
          throttle = false;
          setRotateStart(e.clientX + e.clientY);
        }, 100)
      );
    };
    window.addEventListener("mousemove", mouseHandler);
    return () => {
      window.removeEventListener("mousemove", mouseHandler);
      clearTimeout(timer);
    };
  }, [rotateEnd]);
  return (
    <div
      className={style.container}
      css={css`
        --icon-size: ${size}px;

        
      `}
      
      onClick={props.clickHandler}
    >
      <FiPlusCircle />
      <h2>IMagePlus</h2>
    </div>
  );
}

export default Logo;
