import React from "react";
import { toast } from "react-toastify";
import { boolean } from "zod";
/**
 * 定义upload中useReducer()的准备工作
 */
import { FileListType, FileNameListType, FileErrMsgType } from "../type";
type UploadState = {
  fileList: Array<FileListType>;
  fileNameList: Array<FileNameListType>;
  progress: Array<number>;
  error: FileErrMsgType;
  start: boolean;
  toastId: number;
};
type UploadPayload = {
  "add-file": {
    files: UploadState["fileList"];
    names: UploadState["fileNameList"];
  };
  "reset-file": {
    files: UploadState["fileList"];
    names: UploadState["fileNameList"];
    nums: Array<number>;
  };
  "reset-upload": boolean;
  progress: {
    num: number;
    index: number;
  };
  "change-error": UploadState["error"];
  "toast-id": number;
};
interface IUploadAction {
  type: keyof UploadPayload;
  payload: UploadPayload[IUploadAction["type"]];
}
export const uploadReducer = (state: UploadState, action: IUploadAction) => {
  switch (action.type) {
    case "add-file":
      return {
        ...state,
        fileList: [...(action.payload as UploadPayload["add-file"]).files],
        fileNameList: [...(action.payload as UploadPayload["add-file"]).names],
        start: true,
      };
    case "reset-file":
      return {
        ...state,
        fileList: [...(action.payload as UploadPayload["reset-file"]).files],
        fileNameList: [...(action.payload as UploadPayload["reset-file"]).names],
        start: false,
        progress: [...(action.payload as UploadPayload["reset-file"]).nums]
      };
    case "reset-upload": 
      return {
        ...state,
        start: (action.payload as UploadPayload['reset-upload'])
      }
    case "progress":
      return {
        ...state,
        progress: [...state.progress].map((el, i) => {
          if(i === (action.payload as UploadPayload["progress"]).index)
            return (action.payload as UploadPayload["progress"]).num;
          else
            return el;
        })
      };
    case "change-error":
      return {
        ...state,
        error: action.payload as UploadPayload["change-error"],
      };
    case "toast-id":
      return { ...state, toastId: action.payload as UploadPayload["toast-id"] };
    default:
      return state;
  }
};
export const initialUploadState: UploadState = {
  fileList: [],
  fileNameList: [],
  progress: [],
  error: { name: "", msg: [] },
  start: false,
  toastId: 0,
};
export const useUploader = () => {
  const [state, dispatch] = React.useReducer(uploadReducer, initialUploadState);
  React.useEffect(() => {
    dispatch({ type: "change-error", payload: { name: "", msg: [] } });
  }, [state.toastId]);
  return { state, dispatch };
};
