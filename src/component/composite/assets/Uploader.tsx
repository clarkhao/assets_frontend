/** @jsxImportSource @emotion/react */
/**
 * upload files
 * 在DropZone中使用children-IconChoose，减少重新渲染
 * 使用FormData上传单个或者多个文件
 * files需要验证 类型,extension和size，然后上传
 */
//应用模块
import React from "react";
import { randomString, iconLibrary } from "../../utils";
import { Fragment } from "react";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
//style
import style from "./Uploader.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件
import {
  FileListType,
  FileNameListType,
  FileErrMsgType,
} from "../../utils/type";
import Button from "@mui/material/Button";
import DropZone from "../../ui/DropZoneUI";
import { modifyAndValidate } from "../../utils/validate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import List from "../../ui/ListUI";
//hook
import { useUploader } from "../../utils/hook";

type TUpload = {};

function Uploader({ ...props }: TUpload) {
  /**
   * fileList used to generate FormData, 状态需要清理，在网络请求成功后可以清理
   * fileNameList used to render the List component，状态需要清理，网络请求成功后清理
   * error产生于zod验证和网络请求错误，在react-toastify中展示，最后一个toast展示后给出一个toastId，此时清理
   * 开始上传，在网络请求后清理，失败或者成功
   * process表示上传百分比，网络请求后清理
   * toastId表示最后一个toast,此时清理error
   */
  const theme = useTheme();
  const { state, dispatch } = useUploader();

  const addFiles = (data: FileList | File[]) => {
    console.log(state.start);
    const files = [] as FileListType[];
    const names = [] as FileNameListType[];
    const nums = new Array(data.length).fill(0);
    dispatch({ type: "reset-file", payload: { files, names, nums } });
    for (let i = 0; i < data.length; i++) {
      const file = data[i];
      const validated = modifyAndValidate(file);
      if (validated.success) {
        const randomStr = randomString(8);
        const id = `${randomStr}.${file.name.split(".").reverse()[0]}`;
        console.log(id);
        files.push({ id, file });
        names.push({ id, name: file.name });
      } else {
        let msg: string[] = [];
        for (const e of validated.error.issues) {
          if (e.code === "invalid_enum_value") {
            if (msg.indexOf("不支持的上传格式") < 0)
              msg.push("不支持的上传格式");
          } else {
            msg.push(e.message);
          }
        }
        dispatch({ type: "change-error", payload: { name: file.name, msg } });
      }
    }
    console.log(files);
    dispatch({ type: "add-file", payload: { files, names } });
  };
  React.useEffect(() => {
    if (state.start) {
      console.log(state.fileList);
      parallelUpload(state.fileList);
    }
  }, [state.start]);
  React.useEffect(() => {
    if (state.error.msg.length > 0) {
      toast.error(state.error.name);
      state.error.msg.forEach((e, i, a) => {
        if (a.length - 1 === i) {
          const id = toast.error(e);
          console.log(`toastId: ${id}`);
          dispatch({ type: "toast-id", payload: id as number });
        } else {
          toast.error(e);
        }
      });
    }
  }, [state.error]);
  const parallelUpload = (files: FileListType[]) => {
    const region =
      process.env.REACT_APP_AWS_REGION ?? import.meta.env.STORYBOOK_AWS_REGION;
    const accessKeyId =
      process.env.REACT_APP_AWS_ACCESS_KEY_ID ??
      (import.meta.env.STORYBOOK_AWS_ACCESS_KEY_ID as string);
    const secretAccessKey =
      process.env.REACT_APP_AWS_SECRET_ACCESS_SECRET ??
      (import.meta.env.STORYBOOK_AWS_SECRET_ACCESS_SECRET as string);
    const bucket =
      process.env.REACT_APP_AWS_ADMIN_BUCKET_NAME ??
      (import.meta.env.STORYBOOK_AWS_ADMIN_BUCKET_NAME as string);

    const promises = files.map((f, i) => {
      const uploader = new Upload({
        client: new S3Client({
          region: region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        }),
        params: {
          Bucket: bucket,
          Key: `assets/users/${f.id}`,
          Body: f.file,
        },
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });
      uploader.on("httpUploadProgress", (progress) => {
        console.log(`progress.loaded: ${progress.loaded}`);
        dispatch({
          type: "progress",
          payload: {
            num: Math.round(
              (Number(progress.loaded) / Number(progress.total)) * 100
            ),
            index: i,
          },
        });
      });
      return uploader.done();
    });
    Promise.all(promises)
      .then((res) => {
        console.log(`res: ${JSON.stringify(res)}`);
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Error) {
          dispatch({
            type: "change-error",
            payload: { name: err.name, msg: [err.message] },
          });
        }
      })
      .finally(() => {
        dispatch({ type: "toast-id", payload: 0 });
        dispatch({ type: "reset-upload", payload: false });
      });
  };

  return (
    <Fragment>
      <form
        className={style.container}
        css={css`
          --upload-background-color: ${theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900]};
          --upload-shadow: ${theme.shadows[3]};
          --upload-wrapper-height: ${state.fileNameList.length > 0 ? "95vh" : "70vh"};
        `}
      >
        <div className={style.title}>
          <h1>Upload Your Files</h1>
        </div>
        <DropZone handleAddFiles={addFiles} />
        {state.fileNameList.length > 0 ? (
          <List
            list={state.fileNameList}
            progress={state.progress}
            lIcon
            rIcon
          />
        ) : null}
      </form>
      <ToastContainer />
    </Fragment>
  );
}

export default Uploader;
