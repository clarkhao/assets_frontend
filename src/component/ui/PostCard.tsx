//应用
import React, { useRef, Suspense, Fragment } from "react";
import axios from "axios";
//style
import style from "./PostCard.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import CardLayout from "../layout/CardLayout";
import { FiHeart } from "react-icons/fi";
import Skeleton from "./Skeleton";
import Like from "./Like";
const Avatar = React.lazy(() => import("./Avatar"));
import ErrorBoundary from "./ErrorBoundary";
//hooks
import { useStore } from "../../store";
import { ProfileContext } from "../composite/Profile";
//config
import { API_URL } from "../utils";

type TFileMerge = {
  id: string;
  name: string;
  publicUser: string;
  createdTime: string;
  updatedTime: string;
  expiredTime: string;
  url: string;
};
type TSimpleUser = {
  user: Array<{ name: string; avatar: string; id: string }>;
};
type TLike = {
  like: Array<{ count: number }>;
};
export type TPostCardData = TFileMerge & TSimpleUser & TLike;
type TPostCard = {
  /**
   * size
   */
  size: number;
  /**
   * data from parent
   */
  data: TPostCardData;
  /**
   * cancle
   */
  cancel?: boolean;
  /**
   * like: component
   */
  like: React.ReactNode;
};

function PostCard({ size = 300, data, cancel = false, ...props }: TPostCard) {
  const [isLoaded, setLoaded] = React.useState(false);
  const profile = React.useContext(ProfileContext);

  return (
    <>
      <CardLayout height="auto" width={`${size}px`}>
        <div className={[style.post, !isLoaded ? style.image : ""].join(" ")}>
          {data === undefined || !isLoaded ? (
            <Skeleton cssStr={`--image_skeleton_width: ${size}px;`} />
          ) : null}
          {data === undefined ? null : (
            <>
              <img
                id={data?.id}
                className={style.img}
                src={data?.url}
                alt="image"
                width={size}
                height="auto"
                loading="lazy"
                decoding="auto"
                onLoad={(e) => {
                  setLoaded(true);
                }}
                onClick={() => (window.location.href = data?.url)}
                onError={(e) => {
                  const imageUrl = (e.target as HTMLImageElement).src;
                  console.log(imageUrl);
                }}
              />
              {cancel ? (
                <input
                  type="checkbox"
                  id={data?.id}
                  className={style.checkbox}
                  onChange={(e) => {
                    if (e.target.checked) {
                      profile?.setIds([...profile?.ids, data?.id]);
                    } else {
                      profile?.setIds(
                        profile?.ids.filter((id) => id !== data?.id)
                      );
                    }
                  }}
                />
              ) : null}
            </>
          )}
        </div>
        {data === undefined ? (
          <Fragment>
            <footer className={style.footer}>
              <div className={style.avarta}>
                <Avatar size={40} iconUrl={undefined} />
              </div>
              <Skeleton style={{ width: "200px", height: "30px" }} />
            </footer>
          </Fragment>
        ) : (
          <Fragment>
            <footer className={style.footer}>
              <div className={style.avarta} onClick={() => {}}>
                <Avatar
                  size={40}
                  iconUrl={data?.user[0]?.avatar ?? "/question.svg"}
                />
                <p>{data?.user[0]?.name ?? "???"}</p>
              </div>
              <div className={style.like}>{props.like}</div>
            </footer>
          </Fragment>
        )}
      </CardLayout>
    </>
  );
}

export default PostCard;
