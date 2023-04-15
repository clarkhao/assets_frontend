//应用
import React from "react";
import { FileNameListType } from "../utils/type";
//style
import style from "./Check.module.css";
import { iconLibrary } from "../utils";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件
import Progress from "./ProgressUI";
import FileIcon from "./FileIcon";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

type TCheck = {
  /**
   * bingo
   */
  bingo: boolean;
};

function Check({ bingo = false, ...props }: TCheck) {
  const { rive, RiveComponent } = useRive({
    src: "./collection.riv",
    stateMachines: "check",
    artboard: "check",
  });
  if (bingo) rive?.play();
  return (
    <>
      <RiveComponent style={{ width: "50px", height: "50px" }} />
    </>
  );
}

export default Check;
