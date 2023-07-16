/** @jsxImportSource @emotion/react */
/**
 * upload files
 * 在DropZone中使用children-IconChoose，减少重新渲染
 * 使用FormData上传单个或者多个文件
 * files需要验证 类型,extension和size，然后上传
 */
//应用模块
import React from "react";
import { randomString, API_URL } from "../utils";
import { Fragment } from "react";
import axios, { AxiosProgressEvent } from "axios";
//style
import style from "./Uploader.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件
import { TFileListType, TFileErrMsgType } from "../utils/type";
import Button from "@mui/material/Button";
import DropZone from "../ui/DropZoneUI";
import { modifyAndValidate } from "../utils/validate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import List from "../ui/ListUI";
//hook
import { useUploader, UploadContext } from "../utils/hook";
//types
import { TPresignedUploadUrl } from "../utils/type";
import { useStore } from "../../store";
import { getDictionary } from "../../i18n";

type TUpload = {};

interface Statcis {
  uploaded: number | null;
  limit: number | null;
}

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
  const [data, setData] = React.useState<FileList | File[]>([]);
  const [token, statics, setStatics, i18n] = useStore((state) => [
    state.token,
    state.statics,
    state.setStatics,
    state.i18n
  ]);

  const content = getDictionary(i18n as "jp" | "en" | "cn").upload as Record<
    string,
    any
  >;

  const handleUploadFile = (
    files: TFileListType[],
    el: TPresignedUploadUrl,
    i: number
  ) => {
    return axios.put(el.url, files[i].file, {
      //和后端生成的presigned type保持一致
      headers: { "Content-Type": files[i].file.type },
      //withCredentials: true,
      onUploadProgress: (e: AxiosProgressEvent) => {
        dispatch({
          type: "upload-progress",
          payload: {
            progress: Math.round((e.loaded * 100) / (e.total as number)),
            index: i,
          },
        });
      },
    });
  };
  const handleDbRecord = (filenames: Array<string>) => {
    return axios({
      url: `${API_URL}/api/files`,
      method: "POST",
      data: {
        files: filenames,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const addFiles = (raw: FileList | File[]) => {
    setData(raw);
    dispatch({ type: "reset-all", payload: null });
    dispatch({ type: "set-start", payload: false });
  };

  React.useEffect(() => {
    if (state.start) {
      parallelUpload(state.fileList as TFileListType[]);
    } else {
      const limit = statics.limit;
      const uploaded = statics.uploaded;
      if (data.length > limit - uploaded) {
        dispatch({
          type: "change-error",
          payload: { name: "out of limit", msg: [content.limit_error] },
        });
        setData([]);
        dispatch({ type: "reset-all", payload: null });
      }
      if (data.length > 0) {
        const files = [] as TFileListType[];
        const names = {} as Record<string, string>;

        for (let i = 0; i < data.length; i++) {
          const file = data[i];
          const validated = modifyAndValidate(file);
          if (validated.success) {
            const randomStr = randomString(8);
            const id = `${randomStr}.${file.name.split(".").reverse()[0]}`;
            files.push({
              id,
              file,
              status: {
                upload: "",
                write: "",
              },
              progress: 0,
            });
            names[id] = file.name;
          } else {
            let msg: string[] = [];
            for (const e of validated.error.issues) {
              if (e.code === "invalid_enum_value") {
                if (msg.indexOf(content.format_error) < 0)
                  msg.push(content.format_error);
              } else {
                msg.push(content.size_error);
              }
            }
            dispatch({
              type: "change-error",
              payload: { name: file.name, msg },
            });
          }
        }
        if (files.length > 0) {
          //start
          dispatch({ type: "init-upload", payload: { files, names } });
        }
      }
    }
  }, [state.start]);
  React.useEffect(() => {
    if ((state.error?.msg.length as number) > 0) {
      toast.error(state.error?.name);
      state.error?.msg.forEach((e, i, a) => {
        if (a.length - 1 === i) {
          const id = toast.error(e);
          dispatch({ type: "toast-id", payload: id as number });
        } else {
          toast.error(e);
        }
      });
    }
  }, [state.error]);

  const parallelUpload = async (files: TFileListType[]) => {
    const url = `${API_URL}/api/files/${files.map((f) => f.id).join(",")}`;
    const presignedUrls = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json() as Promise<
          Array<TPresignedUploadUrl> | { code: number; message: string }
        >;
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Error) {
          dispatch({
            type: "change-error",
            payload: { name: err.name, msg: [err.message] },
          });
          setData([]);
          dispatch({ type: "reset-all", payload: null });
        }
      });
    if ((presignedUrls as { code: number; message: string }).code >= 400) {
      dispatch({
        type: "change-error",
        payload: { name: "out of limit", msg: [content.limit_error] },
      });
      setData([]);
      dispatch({ type: "reset-all", payload: null });
      return;
    } else {
      dispatch({
        type: "set-presigned",
        payload: (presignedUrls as Array<TPresignedUploadUrl>).map(
          (el) => el.url
        ),
      });
      if ((presignedUrls as Array<TPresignedUploadUrl>).length > 0) {
        const awsPromises = (presignedUrls as Array<TPresignedUploadUrl>).map(
          (el, i) => handleUploadFile(files, el, i)
        );
        const filenames = files.map((el) => el.id);
        const dbPromise = handleDbRecord(filenames);
        Promise.all([...awsPromises, dbPromise]).then((res) => {
          const awsRes = res.slice(
            0,
            (presignedUrls as Array<TPresignedUploadUrl>).length
          );
          let count = 0;
          awsRes.forEach((el, i) => {
            if (el.status === 200) {
              count++;
              dispatch({
                type: "complete-aws",
                payload: { index: i, status: true },
              });
            } else {
              dispatch({
                type: "change-error",
                payload: {
                  name: (state.fileNameMap as Record<string, string>)[
                    files[i].id
                  ],
                  msg: ["failed to upload, try again?"],
                },
              });

              dispatch({ type: "delete-file", payload: { index: i } });
            }
          });
          const dbRes = res.slice(
            (presignedUrls as Array<TPresignedUploadUrl>).length,
            (presignedUrls as Array<TPresignedUploadUrl>).length + 1
          );
          if (dbRes[0].status === 200 && dbRes[0].data === count) {
            dispatch({ type: "set-db", payload: { status: true } });
          }
          toast.success(`${count}${content.success_msg}`);
          const limit = statics.limit;
          const uploaded = statics.uploaded;
          setStatics({ uploaded: uploaded + count, limit });
          setData([]);
        });
      }
    }
  };

  return (
    <Fragment>
      <UploadContext.Provider value={{ state, dispatch }}>
        <form
          className={style.container}
          css={css`
            --upload-background-color: ${theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900]};
            --upload-font-color: ${theme.palette.text.primary};
            --upload-shadow: ${theme.shadows[3]};
            --upload-wrapper-height: ${(state.fileList?.length as number) > 0
              ? "60vh"
              : "70vh"};
          `}
        >
          <div className={style.title}>
            <h2>{content.title}</h2>
          </div>
          <DropZone handleAddFiles={addFiles} statics={statics} i18n={content.droparea}/>
          {state.fileList !== null &&
          state.fileNameMap !== null &&
          state.start ? (
            <List
              list={state.fileList}
              nameMap={state.fileNameMap}
              lIcon
              rIcon
            />
          ) : null}
        </form>
        <ToastContainer position="bottom-center" />
      </UploadContext.Provider>
    </Fragment>
  );
}

export default Uploader;
