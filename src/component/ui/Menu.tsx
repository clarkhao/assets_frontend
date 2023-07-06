/** @jsxImportSource @emotion/react */
//应用
import React, {Fragment} from "react";
//style
import style from "./Menu.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件

type TMenu = {
  /**
   * isShown
   */
  isShown: boolean;
  /**
   *
   */
  handleElement: (el: string) => void;
  /**
   * content
   */
  content: Array<string>;
  /**
   * id
   */
  id: string;
  /**
   * offset X
   */
  offsetX?: number;
  /**
   * offset Y
   */
  offsetY?: number;
};

function Menu({
  isShown = true,
  handleElement,
  content = ["cn", "en", "jp"],
  offsetY,
  ...props
}: TMenu) {
  const theme = useTheme();
  return (
    <Fragment>
      <ul
        id={props.id}
        className={[style.drop_down_content, isShown ? style.show : ""].join(
          " "
        )}
        css={css`
          --menu-absolute-offset: ${props.offsetX}px;
          --menu-text-color: ${theme.palette.mode === "dark"
            ? theme.palette.grey[200]
            : theme.palette.grey[700]};
          --menu-button-bg: ${theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[300]};
          --menu-offset-y: ${offsetY}px;
        `}
      >
        {content.map((v, i) => (
          <li
            key={`menu-item-${i}`}
            onClick={(e) => {
              e.preventDefault;
              e.stopPropagation();
              handleElement(v);
            }}
          >
            {v}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default Menu;
