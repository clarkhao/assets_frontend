//应用
import React from "react";
import { FileNameListType } from "../utils/type";
//style
import style from "./ListUI.module.css";
import { iconLibrary } from "../utils";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件
import Progress from "./ProgressUI";
import FileIcon from "./FileIcon";
import Check from "./Check";

export type ListType = {
  /**
   * list that is used to render
   */
  list: Array<FileNameListType>;
  /**
   * progress
   */
  progress: Array<number>;
  /**
   * optional left icon
   */
  lIcon?: boolean;
  /**
   * optional right icon
   */
  rIcon?: boolean;
};

function List({ list, lIcon = true, rIcon = true, ...props }: ListType) {
  const theme = useTheme();
  return (
    <>
      <ul
        className={style.container}
        css={css`
          background-color: ${theme.palette.primary.main};
        `}
      >
        {(
          list ?? [
            { id: "a", name: "a.jpg", progress: 12 },
            { id: "b", name: "b.svg", progress: 100 },
            { id: "c", name: "c.pdf", progress: 89 },
          ]
        ).map((el,i) => {
          return (
            <li key={el.id.split('.')[0]}>
              {lIcon ? (
                <FileIcon size={50} type={el.name.split(".").reverse()[0]} />
              ) : null}
              <Progress value={props.progress[i]} text={el.name} />
              {rIcon ? <Check bingo={props.progress[i] >= 100} /> : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default List;
