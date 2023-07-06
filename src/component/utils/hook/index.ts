import React from "react";
/**
 * 定义upload中useReducer()的准备工作
 * 上传3个阶段：success-S, fail-F
 * 检查, start
 * 1，获取presigned url, F->放弃, S->继续
 * 2, 上传到aws，F->重试，S->继续
 * 3, 写数据到db，F->后端协调，S->finish
 */
import { TFileListType, TFileErrMsgType, Statcis } from "../type";
type UploadState = {
  fileList: Array<TFileListType> | null;
  fileNameMap: Record<string, string> | null;
  presigned: Array<string>;
  start: boolean | null;
  statics: Statcis;
  error: TFileErrMsgType | null;
  toastId: number;
};
type UploadPayload = {
  "init-upload": {
    files: UploadState["fileList"];
    names: UploadState["fileNameMap"];
  };
  "reset-all": null;
  "set-start": boolean;
  //index
  "set-presigned": Array<string>;
  "upload-progress": { index: number; progress: number };
  "complete-aws": { index: number; status: boolean };
  "delete-file": { index: number };
  "set-statics": { data: Statcis };
  "set-db": { status: boolean };

  "change-error": UploadState["error"];
  "toast-id": number;
};
interface IUploadAction {
  type: keyof UploadPayload;
  payload: UploadPayload[IUploadAction["type"]];
}
export const uploadReducer = (state: UploadState, action: IUploadAction) => {
  switch (action.type) {
    case "init-upload":
      return {
        ...state,
        fileList: [
          ...((action.payload as UploadPayload["init-upload"])
            .files as Array<TFileListType>),
        ],
        fileNameMap: {
          ...(action.payload as UploadPayload["init-upload"]).names,
        },
        start: true,
      };
    case "reset-all":
      return {
        ...state,
        fileList: [] as Array<TFileListType>,
        fileNameMap: {} as Record<string, string>,
        start: null,
        statics: {
          uploaded:
            sessionStorage.getItem("statics") === null
              ? 0
              : parseInt(
                  JSON.parse(sessionStorage.getItem("statics")!).uploaded
                ),
          limit:
            sessionStorage.getItem("statics") === null
              ? 0
              : parseInt(JSON.parse(sessionStorage.getItem("statics")!).limit),
        },

      };
    case "set-start":
      return {
        ...state,
        start: action.payload as UploadState["start"],
      };
    case "set-presigned":
      return {
        ...state,
        presigned: action.payload as UploadPayload["set-presigned"],
      };
    case "upload-progress":
      return {
        ...state,
        fileList: state.fileList?.map((value, index) => {
          if (
            index ===
            (action.payload as UploadPayload["upload-progress"])["index"]
          ) {
            return {
              ...value,
              progress: (action.payload as UploadPayload["upload-progress"])[
                "progress"
              ],
            };
          }
          return value;
        }) as Array<TFileListType>,
      };
    case "complete-aws":
      return {
        ...state,
        fileList: state.fileList?.map((value, index) => {
          if (
            index === (action.payload as UploadPayload["complete-aws"])["index"]
          ) {
            return {
              ...value,
              status: {
                ...value.status,
                upload: (action.payload as UploadPayload["complete-aws"])[
                  "status"
                ]
                  ? "S"
                  : "F",
              },
            };
          }
          return value;
        }) as Array<TFileListType>,
      };
    case "delete-file":
      return {
        ...state,
        fileList: state.fileList?.filter((value, index) => {
          return (
            index !== (action.payload as UploadPayload["delete-file"])["index"]
          );
        }) as TFileListType[],
        presigned: state.presigned.filter((value, index) => {
          return (
            index !== (action.payload as UploadPayload["delete-file"])["index"]
          );
        }) as Array<string>,
      };
    case "set-statics":
      return {
        ...state,
        statics: (action.payload as UploadPayload["set-statics"])["data"],
      };
    case "set-db":
      return {
        ...state,
        fileList: state.fileList?.map((value) => {
          return {
            ...value,
            status: {
              ...value.status,
              write: (action.payload as UploadPayload["set-db"])["status"]
                ? "S"
                : "F",
            },
          };
        }) as Array<TFileListType>,
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
  fileNameMap: {},
  presigned: [],
  start: null,
  statics: {
    uploaded:
      sessionStorage.getItem("statics") === null
        ? 0
        : parseInt(JSON.parse(sessionStorage.getItem("statics")!).uploaded),
    limit:
      sessionStorage.getItem("statics") === null
        ? 0
        : parseInt(JSON.parse(sessionStorage.getItem("statics")!).limit),
  },
  error: { name: "", msg: [] },
  toastId: 0,
};
export const useUploader = () => {
  const [state, dispatch] = React.useReducer(uploadReducer, initialUploadState);
  React.useEffect(() => {
    dispatch({ type: "change-error", payload: { name: "", msg: [] } });
  }, [state.toastId]);

  return { state, dispatch };
};

export const UploadContext = React.createContext<{
  state: UploadState;
  dispatch: React.Dispatch<IUploadAction>;
} | null>(null);
