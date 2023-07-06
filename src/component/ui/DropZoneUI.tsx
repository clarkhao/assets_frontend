/** @jsxImportSource @emotion/react */
//应用
import React from "react";
import axios from "axios";
import { API_URL } from "../utils";
//style
import style from "./DropZoneUI.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { UploadContext } from "../utils/hook";

interface Statcis {
  uploaded: number | null;
  limit: number | null;
}

export type DropZoneType = {
  /**
   *
   */
  handleAddFiles: (data: FileList | File[]) => void;
  /**
   * height of the container
   */
  height?: string;
  /**
   * upload statics
   */
  statics: Statcis;
};

function DropZone({ handleAddFiles, ...props }: DropZoneType) {
  const theme = useTheme();
  const id = React.useId();
  const [dragActive, setDragActive] = React.useState(false);

  const { rive, RiveComponent } = useRive({
    src: "../folder.riv",
    stateMachines: "folder",
    artboard: "folder",
  });
  const onHoverInput = useStateMachineInput(rive, "folder", "open");

  React.useEffect(() => {
    if ((props.statics.limit ?? 0) - (props.statics.uploaded ?? 0) > 0) {
      rive?.play();
    }
  }, [onHoverInput?.value, props.statics]);
  const handleDrag: React.DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
    if (onHoverInput !== null) onHoverInput.value = true;
    if ((props.statics.limit ?? 0) - (props.statics.uploaded ?? 0) > 0) {
      rive?.play();
    }
  };
  const handleDragOver: React.DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
    if (onHoverInput !== null) onHoverInput.value = true;
    if ((props.statics.limit ?? 0) - (props.statics.uploaded ?? 0) > 0) {
      rive?.play();
    }
  };
  const handleDragLeave: React.DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (onHoverInput !== null) onHoverInput.value = false;
    if ((props.statics.limit ?? 0) - (props.statics.uploaded ?? 0) > 0) {
      rive?.play();
    }
  };
  const handleDrop: React.DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (onHoverInput !== null) onHoverInput.value = false;
    if ((props.statics.limit ?? 0) - (props.statics.uploaded ?? 0) > 0) {
      rive?.play();
      handleAddFiles(e.dataTransfer.files);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if ((props.statics.limit ?? 0) - (props.statics.uploaded ?? 0) > 0) {
      rive?.play();
      handleAddFiles(e.target.files as FileList);
    }
  }

  return (
    <div
      className={[style.container, dragActive ? style.highlight : ""].join(" ")}
      css={css`
        --droparea-height: ${props.height};
        --droparea-bg-color: ${theme.palette.mode === "light"
          ? theme.palette.grey[300]
          : theme.palette.background.default};
        --droparea-font-color: ${theme.palette.text.primary};
        --droparea-shadow: ${theme.shadows[3]};
        --droparea-drop-bg-color: ${theme.palette.mode === "light"
          ? theme.palette.grey[200]
          : theme.palette.grey[700]};
      `}
      onDragEnter={handleDrag}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={id}
        multiple
        className={style.upload}
        disabled={(props.statics.limit ?? 0) - (props.statics.uploaded ?? 0) <= 0}
        onChange={handleChange}
      />
      <label htmlFor={id} className={style.droparea}>
        <RiveComponent
          onMouseEnter={() => {
            if (onHoverInput !== null) onHoverInput.value = true;
          }}
          onMouseLeave={() => {
            if (onHoverInput !== null) onHoverInput.value = false;
          }}
        />
      </label>
      <div className={style.before}>
        <p>{`Limit: ${props.statics.limit} and Uploaded: ${props.statics.uploaded}`}</p>
        <p>Drag & Drop your files here</p>
        <p>or Click above Icon to select files</p>
      </div>
    </div>
  );
}

export default DropZone;
