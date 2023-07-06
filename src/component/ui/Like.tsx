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
import type { TPostCardData } from "./PostCard";

type TLike = {
  /**
   * likes
   */
  likes: number;
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
  const [initLike, setInitLike] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [savedLike, setSavedLike] = React.useState<boolean>(liked);
  const [userStr, setUserStr] = React.useState<string | null>(() =>
    sessionStorage.getItem("user")
  );
  React.useEffect(() => {
    if (
      props.isAuth &&
      fileKey !== undefined &&
      fileKey !== null &&
      fileKey !== ""
    ) {
      if (props.isAuth && userStr !== null) {
        const user = `publicUser:${JSON.parse(userStr).publicUser}`;
        console.log("开始");
        db.authenticate(PUBLIC_TOKEN)
          .then(async () => {
            await db.use({ ns: "test", db: "test" });
            const query = (
              await db.query(
                `
            select count() as count from like where in=${user} and out=${fileKey};
            `.trim()
              )
            )[0].result as Array<{ count: number }>;
            if (query.length === 0) {
              setInitLike(false);
              setLiked(false);
            } else {
              setInitLike(true);
              setLiked(true);
            }
          })
          .catch((err) => {
            if (err instanceof Error) {
              console.log(err.message);
            }
          });
      }
    }
  }, [props.isAuth]);

  React.useEffect(() => {
    if (
      timer > 0 &&
      fileKey !== undefined &&
      fileKey !== null &&
      fileKey !== ""
    ) {
      console.log("改变like");
      const userStr = sessionStorage.getItem("user");
      const user = `publicUser:${JSON.parse(userStr ?? "{}").publicUser}`;
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
            const cache = ["index-file", "profile-own", "profile-like"];
            cache
              .map((key) => sessionStorage.getItem(key))
              .map((storage) => {
                if (storage !== null) {
                  return JSON.parse(storage) as Array<TPostCardData>;
                } else return null;
              })
              .forEach((list, index) => {
                if (list !== null) {
                  const updatedList = list.map((item) => {
                    if (item.id === fileKey) {
                      const count = savedLike
                        ? item.like[0].count + 1
                        : item.like[0].count - 1;
                      return { ...item, like: [{ count }] };
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
        className={[style.container, liked && props.isAuth ? style.liked : ""].join(" ")}
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
              }, 500)
            );
          }}
        />
      ) : null}
    </Fragment>
  );
}

export default Like;
