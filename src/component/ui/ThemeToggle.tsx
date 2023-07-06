/** @jsxImportSource @emotion/react */
//应用
import React, { Fragment } from "react";
import { useStore } from "../../store";
//style
import style from "./ThemeToggle.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import { FiSun, FiMoon } from "react-icons/fi";

type SwitchType = {
  /**
   * is svg icon needed?
   */
  isSvg?: boolean;
  /**
   * size
   */
  size?: number;
};

function ThemeToggle({ isSvg = true, size = 100, ...props }: SwitchType) {
  const theme = useTheme();
  const id = React.useId();
  const [themeMode, toggleTheme] = useStore((state) => [state.themeMode, state.toggleTheme]);
  const [toggle, setToggle] = React.useState(themeMode === 'dark');

  const handleClick = () => {
    setToggle(!toggle);
    if (toggle) toggleTheme("light");
    else toggleTheme("dark");
  };
  return (
    <Fragment>
      <input className={style.input} type="checkbox" id={id} name="theme-toggle"/>
      <label
        className={style.label}
        htmlFor={id}
        onClick={handleClick}
        css={css`
          --switch-bg: ${toggle
            ? "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)"
            : "linear-gradient(to bottom, #4facfe, #00f2fe)"};
          --switch-btn-color: ${toggle ? "#003" : "white"};
          --toggle-size: ${size}px;
          --toggle-box-shadow: ${theme.shadows[4]};
        `}
      >
        <span className={style.toggle}>
          {isSvg ? toggle ? <FiMoon /> : <FiSun /> : null}
        </span>
      </label>
    </Fragment>
  );
}

export default ThemeToggle;