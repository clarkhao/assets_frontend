//应用
import React, { Fragment } from "react";
import { API_URL, db, PUBLIC_TOKEN } from "../utils";
import axios from "axios";
//style
import style from "./Arrangement.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import PostCard from "../ui/PostCard";
import { Masonry } from "masonic";
import Spin from "../ui/Spin";
//type
import { TPostCardData } from "../ui/PostCard";
import { TPresignedImage } from "../utils/type";
import type { IProfile } from "./Profile";
//hooks
import { LoadingContext } from "../../pages/index";
import type { ILoading } from "../../pages/index";
import { useLocation } from "react-router-dom";
import { ProfileContext } from "./Profile";
import Like from "../ui/Like";
import { useStore } from "../../store";

type TArrangement = {
  /**
   * width
   */
  width: number;
  /**
   * margin top
   */
  top: number;
  /**
   * handle query
   */
  query?: (records: number, current?: string) => string;
  /**
   * addScrollListener
   */
  addScrollListener?: (handler: () => void) => void;
  /**
   * removeScrollListener
   */
  removeScrollListener?: (handler: () => void) => void;
  /**
   * isAtBottom?
   */
  atBottom?: () => boolean;
};
interface MasonryProps {
  columnWidth: number;
  gutter: number;
  children: React.ReactNode;
}
function Arrangement({
  width = 200,
  top = 170,
  query = (records, current) =>
    `select *, (select * from $parent.publicUser) as user, ((select count() from publicUser where ->like->(presignedImage where id=$parent.id) group all) || [{count: 0}]) as like from presignedImage where "${current}" < (expiredTime - 2h) order by expiredTime, name limit 16 start ${records};`,
  addScrollListener = (handleScroll) => {
    window.addEventListener("scroll", handleScroll);
  },
  removeScrollListener = (handleScroll) => {
    window.removeEventListener("scroll", handleScroll);
  },
  atBottom = () =>
    window.innerHeight + window.scrollY >= document.body.scrollHeight,
  ...props
}: TArrangement) {
  const load = React.useContext<ILoading | null>(LoadingContext);
  const profile = React.useContext(ProfileContext);
  const map = initMap(profile?.from ?? "index-file");
  const [files, setFiles] = React.useState(map);
  const [timer, setTimer] = React.useState<number>(0);
  //防止文件过期，重新刷新读取，201返回表示文件正在更新中
  const [refresh, setRefresh] = React.useState<boolean>(false);
  //
  const [fetchToggle, setFetchToggle] = React.useState<boolean>(false);
  React.useEffect(() => {
    console.log("Arrangement here")
  }, [])

  React.useEffect(() => {
    console.log(`fetchComplete: ${load?.fetchComplete}`);
    let throttle = false;
    const handleScroll = () => {
      if (throttle) return;
      const isAtBottom = atBottom();
      if (isAtBottom) {
        //fetchImages();
        if (!load?.fetchComplete) {
          setFetchToggle((prev) => !prev);
        }
        console.log("scroll bottom event");
        throttle = true;
        setTimer(
          window.setTimeout(() => {
            throttle = false;
          }, 2000)
        );
      }
    };
    addScrollListener(handleScroll);

    if (!load?.fetchComplete) {
      setFetchToggle((prev) => !prev);
    }
    return () => {
      removeScrollListener(handleScroll);
      clearTimeout(timer);
    };
  }, [refresh, load?.fetchComplete]);

  React.useEffect(() => {
    console.log(`fetchToggle: ${fetchToggle}`);
    const fetchImages = async () => {
      console.log(`start to fetch at ${files.size ?? 0}`);
      db.use({ ns: "test", db: "test" })
        .then(async () => {
          const now = new Date();
          now.setHours(new Date().getHours() + 8);
          const current = now.toISOString();

          const images = (await db.query(query(files.size, current)))[0]
            .result as TPostCardData[];
          if (images.length === 0) {
            load?.setFetchComplete(true);
          }
          const map = images.reduce((acc, image) => {
            return acc.set(image.id, image);
          }, new Map<string, TPostCardData>());
          setFiles((prev) => new Map([...prev, ...map]));

          if (images?.length < 16) {
            if (profile !== null && profile.from === "profile-own") {
              if (files.size + images.length === profile.data.uploaded) return;
            } else if (profile !== null && profile.from === "profile-like") {
              if (files.size + images.length === profile.data.likes) return;
            }
            console.log("need update");
            const ok = await axios({
              url: `${API_URL}/api/files/update`,
              method: "get",
            }).then((res) => res.status);
            if (images.length === 0 && ok === 201) setRefresh(!refresh);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (!load?.fetchComplete) fetchImages();
  }, [fetchToggle]);
  React.useEffect(() => {
    console.log(`files: updated`);
    //cache
    const cacheKey = profile?.from ?? "index-file";
    const preCache = currentCache(cacheKey);
    const preCacheMap = preCache.reduce((acc, image) => {
      return acc.set(image.id, image);
    }, new Map<string, TPostCardData>());
    const newCacheMap =
      preCache.length !== 0
        ? new Map<string, TPostCardData>([...preCacheMap, ...files])
        : files;
    const newCacheList = Array.from(newCacheMap)
      .map((el) => el[1])
      .sort((a, b) => Date.parse(a.expiredTime) - Date.parse(b.expiredTime))
      .slice(0, 16);
    sessionStorage.setItem(cacheKey, JSON.stringify(newCacheList));
  }, [files]);
  return (
    <div
      className={style.container}
      css={css`
        --padding-top: ${top}px;
      `}
    >
      {files.size > 0 ? (
        <Masonry
          items={Array.from(files).map((el) => el[1])}
          render={Card}
          // Adds 8px of space between the grid cells
          columnGutter={8}
          // Sets the minimum column width to 172px
          columnWidth={320}
          // Pre-renders 5 windows worth of content
          overscanBy={8}
        />
      ) : null}
    </div>
  );
}
function Card({ data }: { data: TPostCardData }) {
  const profile = React.useContext(ProfileContext);
  const location = useLocation();
  const [isAuth] = useStore((state) => [state.isAuth]);
  React.useEffect(() => {
    console.log("card here")
  }, [])
  return (
    <div key={data.id} className={style.card}>
      {location?.pathname === "/profile" && profile?.from === "profile-own" ? (
        <PostCard
          data={data}
          size={320}
          cancel={true}
          like={
            <Like
              likes={data?.like[0]?.count}
              fileKey={data.id}
              isAuth={isAuth}
            />
          }
        />
      ) : (
        <PostCard
          data={data}
          size={320}
          like={
            <Like
              likes={data?.like[0]?.count}
              fileKey={data.id}
              isAuth={isAuth}
            />
          }
        />
      )}
    </div>
  );
}

function initMap(cacheKey: string) {
  return [cacheKey]
    .map((el) => sessionStorage.getItem(el))
    .map((str) => {
      if (str !== null) return JSON.parse(str) as Array<TPostCardData>;
      else return null;
    })
    .map((item) => {
      if (item !== null) {
        return item.reduce((acc, image) => {
          if (image !== null) return acc.set(image.id, image);
          else return acc;
        }, new Map<string, TPostCardData>());
      } else return new Map<string, TPostCardData>();
    })[0];
}
function currentCache(cacheKey: string) {
  const now = new Date();
  now.setHours(new Date().getHours() + 8);
  const current = now.toISOString();
  return [cacheKey]
    .map((key) => sessionStorage.getItem(key))
    .map((cacheStr) => {
      if (cacheStr !== null) return initMap(cacheKey);
      else return null;
    })
    .map((map) => {
      if (map !== null) {
        return Array.from(map)
          .map((el) => el[1])
          .filter((el) => el.expiredTime > current);
      } else return [] as Array<TPostCardData>;
    })[0];
}

export default Arrangement;
