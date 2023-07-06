/** @jsxImportSource @emotion/react */
//应用
import React from "react";
import { useStore } from "../../store";
//style
import style from "./Selector.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import { FiGlobe } from "react-icons/fi";
import Menu from "./Menu";
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom";

type TSelect = {
  /**
   * size
   */
  size?: number;
  /**
   * offsetY
   */
  offsetY: number;
};

function Selector({ size = 50, ...props }: TSelect) {
  const theme = useTheme();
  const changeI18n = useStore((state) => state.changeI18n);
  const i18n = useStore((state) => state.i18n);
  const navigate =
    import.meta.env.MODE === "development" ? null : useNavigate();
  const location =
    import.meta.env.MODE === "development" ? null : useLocation();
  const locales = ["en", "cn", "jp"];
  const [inProp, setInProp] = React.useState(false);

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    setInProp(!inProp);
  };
  const handleElement = (v: string) => {
    const pathName =
      i18n === import.meta.env.VITE_DEFAULT_LACALE
        ? location?.pathname
        : location?.pathname.replace(`/${i18n}`, "");
    const locale = v === import.meta.env.VITE_DEFAULT_LACALE ? "" : `/${v}`;
    const path = `${locale}${pathName}`;
    console.log(path);
    if (import.meta.env.MODE !== "development")
      (navigate as NavigateFunction)(path);
    changeI18n(v);
    setInProp(false);
  };
  React.useEffect(() => {
    //change the i18n locale if location.pathname starts with 'cn' or 'jp'
    if (import.meta.env.MODE !== "development") {
      if (locales.includes((location?.pathname as string).split("/")[1])) {
        changeI18n((location?.pathname as string).split("/")[1]);
      }
    }

    const mouseHandler = (e: MouseEvent) => {
      const dropdown = document.querySelector("#i18n-show");
      const button = document.querySelector("#i18n-btn") as Node;
      if (dropdown && !button.contains(e.target as Node)) {
        setInProp(false);
      }
    };
    window.addEventListener("click", mouseHandler);
    return () => {
      window.removeEventListener("click", mouseHandler);
    };
  }, []);
  return (
    <div
      id="i18n-btn"
      className={style.btn}
      onClick={handleSelect}
      css={css`
        --select-size: ${size}px;
        --i18n-button-bg: ${theme.palette.mode === "dark"
          ? theme.palette.grey[700]
          : theme.palette.grey[300]};
        --select-text-color: ${theme.palette.mode === "dark"
          ? theme.palette.grey[200]
          : theme.palette.grey[700]};
        --select-box-shadow: ${theme.shadows[4]};
      `}
    >
      <FiGlobe />
      <span className={style.title}>{i18n}</span>
      <Menu
        id="i18n-show"
        isShown={inProp}
        handleElement={handleElement}
        content={["cn", "en", "jp"]}
        offsetX={-(100 - size) / 2}
        offsetY={props.offsetY ?? 5}
      />
    </div>
  );
}

export default Selector;
