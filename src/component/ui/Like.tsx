//应用
import React, { Fragment, useRef } from "react";
import { API_URL, db, PUBLIC_TOKEN, TOKEN } from "../utils";
//style
import style from "./Like.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import { FiHeart } from "react-icons/fi";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary";
//type
import type { TPostCardFetch, TPostCardData } from "./PostCard";

type TLike = {
  /**
   * likes
   */
  likes: number;
  /**
   * liked
   */
  liked: boolean;
  /**
   * key
   */
  fileKey: string;
  /**
   * isAuth
   */
  isAuth: boolean;
};

function LikeComponent({
  likes,
  fileKey,
  ...props
}: TLike & { handler: () => void }) {
  const [initLike, setInitLike] = React.useState(props.liked);
  const [liked, setLiked] = React.useState(props.liked);
  const [timer, setTimer] = React.useState(0);
  const [savedLike, setSavedLike] = React.useState<boolean>(props.liked);

  React.useEffect(() => {
    if (
      timer > 0 &&
      fileKey !== undefined &&
      fileKey !== null &&
      fileKey !== ""
    ) {
      const userStr = sessionStorage.getItem("user");
      const user = `publicUser:${JSON.parse(userStr ?? "{}").id}`;
      axios({
        url: API_URL + "/api/likes",
        method: savedLike ? "POST" : "DELETE",
        data: {
          key: fileKey,
          user,
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            //cache handle
            const cache = ["index-file"];
            cache
              .map((key) => sessionStorage.getItem(key))
              .map((storage) => {
                if (storage !== null) {
                  return JSON.parse(storage) as Array<TPostCardData>;
                } else return null;
              })
              .forEach((list, index) => {
                let changedItem: TPostCardData | null = null;
                if (list !== null) {
                  const updatedList = list.map((item) => {
                    if (item.id === fileKey) {
                      const count = savedLike
                        ? item.like[0].count + 1
                        : item.like[0].count - 1;
                      changedItem = {
                        ...item,
                        like: [{ count }],
                        liked: savedLike,
                      };
                      return { ...item, like: [{ count }], liked: savedLike };
                    } else return item;
                  });
                  const updatedStr = JSON.stringify(updatedList);
                  sessionStorage.setItem(cache[index], updatedStr);
                }
              });
          }
        })
        .catch((err) => {
          if (err instanceof Error) {
            console.log(err.message);
          }
          props.handler();
        });
    }
    return () => clearTimeout(timer);
  }, [savedLike]);

  return (
    <Fragment>
      <div
        className={[
          style.container,
          liked && props.isAuth ? style.liked : "",
        ].join(" ")}
        onClick={() => {
          if (!props.isAuth) return;
          clearTimeout(timer);
          setTimer(
            window.setTimeout(() => {
              setSavedLike(!liked);
            }, 1000)
          );
          setLiked(!liked);
        }}
      >
        <span>
          {initLike ? (liked ? likes : likes - 1) : liked ? likes + 1 : likes}
        </span>
        <FiHeart />
      </div>
    </Fragment>
  );
}

function Like({ likes, fileKey, ...props }: TLike) {
  const [mounted, setMounted] = React.useState(true);
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    return () => clearTimeout(timer);
  }, [timer]);
  return (
    <Fragment>
      {mounted ? (
        <LikeComponent
          {...props}
          likes={likes}
          fileKey={fileKey}
          handler={() => {
            setMounted(false);
            setTimer(
              window.setTimeout(() => {
                setMounted(true);
              }, 3000)
            );
          }}
        />
      ) : null}
    </Fragment>
  );
}

export default Like;
