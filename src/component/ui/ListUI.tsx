//应用
import React from "react";
import axios, { AxiosProgressEvent } from "axios";
//style
import style from "./ListUI.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件
import Progress from "./ProgressUI";
import FileIcon from "./FileIcon";
import Check from "./Check";
//hooks
import { useStore } from "../../store";

type TFileList = {
  id: string;
  status: { upload: string; write: string };
  progress: number;
};

export type ListType = {
  /**
   * list that is used to render
   */
  list: Array<TFileList>;
  /**
   * nameMap
   */
  nameMap: Record<string, string>;
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
  const themeMode = useStore((state) => state.themeMode);
  return (
    <>
      <ul
        className={[style.container, `${themeMode}-container`].join(" ")}
        css={css`
          background-color: ${theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[100]};
        `}
      >
        {list.map((el, i) => {
          const name = props.nameMap[el.id];
          const progress =
            el.status.write !== "S"
              ? el.progress !== 100
                ? el.progress
                : 99
              : 100;

          return (
            <li key={name.split(".")[0]}>
              {lIcon ? (
                <FileIcon size={50} type={name.split(".").reverse()[0]} />
              ) : null}
              <Progress value={progress} text={name} />
              {rIcon ? <Check bingo={el.status.write === "S"} /> : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default List;
