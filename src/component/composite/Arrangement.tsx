//应用
import React, { Fragment } from "react";
import { API_URL, db, PUBLIC_TOKEN } from "../utils";
import axios from "axios";
//style
import style from "./Arrangement.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import PostCard, { TPostCardFetchWithLiked } from "../ui/PostCard";
import {
  Masonry,
  MasonryScroller,
  useContainerPosition,
  usePositioner,
  useResizeObserver,
} from "masonic";
//type
import { TPostCardFetch, TPostCardData } from "../ui/PostCard";
//hooks
import { LoadingContext } from "../../pages/index";
import type { ILoading } from "../../pages/index";
import { useLocation } from "react-router-dom";
import { ProfileContext } from "./Profile";
import Like from "../ui/Like";
import { useStore } from "../../store";
import { useWindowSize } from "@react-hook/window-size";

type TArrangement = {
  /**
   * width
   */
  arrageWidth: number;
  /**
   * margin top
   */
  top: number;
  /**
   * handle query
   */
  query?: (records: number) => string;
};
interface MasonryProps {
  columnWidth: number;
  gutter: number;
  children: React.ReactNode;
}
function Arrangement({
  arrageWidth = 200,
  top = 170,
  query = (records) =>
    `select *, (select * from $parent.publicUser) as user, ((select count() from publicUser where ->like->(presignedImage where id=$parent.id) group all) || [{count: 0}]) as like from presignedImage order by createdTime, name limit 16 start ${records};`,
  ...props
}: TArrangement) {
  const load = React.useContext<ILoading | null>(LoadingContext);
  const profile = React.useContext(ProfileContext);
  const map = initMap(profile?.from ?? "index-file");
  const [files, setFiles] = React.useState(map);
  const [timer, setTimer] = React.useState<number>(0);
  const [fetchToggle, setFetchToggle] = React.useState<boolean>(false);
  const [isAuth, statics, deletingIds, setDeletingIds, deleted, setDeleted] =
    useStore((state) => [
      state.isAuth,
      state.statics,
      state.deletingIds,
      state.setDeletingIds,
      state.deleted,
      state.setDeleted,
    ]);

  const user = sessionStorage.getItem("user");
  const userId = user ? `publicUser:${JSON.parse(user).id}` : "";

  React.useEffect(() => {
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.body.scrollHeight;
    let throttle = false;
    const handleScroll = () => {
      if (throttle) return;
      const isAtBottom = atBottom();
      if (isAtBottom) {
        if (!load?.fetchComplete) {
          setFetchToggle((prev) => !prev);
        }
        //scroll bottom event
        throttle = true;
        setTimer(
          window.setTimeout(() => {
            throttle = false;
          }, 2000)
        );
      }
    };
    window.addEventListener("scroll", handleScroll);

    if (!load?.fetchComplete) {
      setFetchToggle((prev) => !prev);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  React.useEffect(() => {
    let timer = 0;
    let throttle = false;
    const fetchImages = async () => {
      db.use({ ns: "test", db: "test" })
        .then(async () => {
          const original = `select *, (select * from $parent.publicUser) as user, ((select count() from publicUser where ->like->(presignedImage where id=$parent.id) group all) || [{count: 0}]) as like, (select count() from like where in=${userId} and out=$parent.id) as liked from presignedImage order by createdTime, name limit 16 start ${files.size};`;
          const queryPhrase =
            isAuth && profile === null ? original : query(files.size);

          const images = (
            (await db.query(queryPhrase))[0].result as
              | TPostCardFetch[]
              | TPostCardFetchWithLiked[]
          ).map((el) => {
            let liked = false;
            if (profile?.from === "profile-like") {
              liked = true;
            } else if (
              (isAuth && profile === null) ||
              profile?.from === "profile-own"
            ) {
              if ((el as TPostCardFetchWithLiked).liked.length > 0) {
                liked = true;
              }
            }
            return { ...el, liked };
          });
          const map = images.reduce((acc, image) => {
            return acc.set(image.id, image);
          }, new Map<string, TPostCardData>());
          if (images.length < 16) {
            timer = window.setTimeout(
              () => load?.setFetchComplete(true),
              10000
            );
          }
          setFiles((prev) => new Map([...prev, ...map]));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const fetchCorrect = async () => {
      if (throttle) return;
      axios({
        url: `${API_URL}/api/files/${userId.split(":")[1]}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) load?.setFetchComplete(false);
        })
        .catch((err) => console.log(err));
      throttle = true;
      setTimer(
        window.setTimeout(() => {
          throttle = false;
        }, 8000)
      );
    };
    if (!load?.fetchComplete) fetchImages();
    else {
      if (profile?.from === "profile-own") {
        if (files.size < statics.uploaded) {
          fetchCorrect();
        }
      }
    }
    return () => clearTimeout(timer);
  }, [fetchToggle]);
  React.useEffect(() => {
    //cache
    if (profile === null) {
      const preCache = currentCache("index-file");
      const preCacheMap = preCache.reduce((acc, image) => {
        return acc.set(image.id, image);
      }, new Map<string, TPostCardData>());
      const newCacheMap =
        preCache.length !== 0
          ? new Map<string, TPostCardData>([...preCacheMap, ...files])
          : files;
      const newCacheList = Array.from(newCacheMap)
        .map((el) => el[1])
        .sort((a, b) => Date.parse(a.createdTime) - Date.parse(b.createdTime))
        .slice(0, 16);
      sessionStorage.setItem("index-file", JSON.stringify(newCacheList));
    } else {
    }
  }, [files]);
  React.useEffect(() => {
    if (deleted && profile?.from === "profile-own") {
      const prevList = Array.from(files).map((el) => el[1]);
      const currentList = prevList.filter(
        (el) => !deletingIds.some((id) => id === el.id)
      );
      const currentMap = currentList.reduce((acc, image) => {
        return acc.set(image.id, image);
      }, new Map<string, TPostCardData>());
      setFiles(currentMap);
      setDeletingIds([]);
      setDeleted(false);
    }
  }, [deleted]);
  React.useEffect(() => {
    const fetchLiked = () => {
      const userStr = sessionStorage.getItem("user") ?? new Error("not auth");
      if (userStr instanceof Error) return;
      const user = `publicUser:${JSON.parse(userStr).id}`;
      db.authenticate(PUBLIC_TOKEN).then(async () => {
        await db.use({ ns: "test", db: "test" });
        new Map(files).forEach(async (el) => {
          const query = (
            await db.query(
              `
              select count() as count from like where in=${user} and out=${el.id};
              `.trim()
            )
          )[0].result as Array<{ count: number }>;
          if (query[0]?.count > 0) {
            setFiles(
              (prev) => new Map([...prev, [el.id, { ...el, liked: true }]])
            );
          }
        });
      });
    };
    if (isAuth && files.size > 0 && profile === null) {
      fetchLiked();
    }
  }, []);
  const containerRef = React.useRef(null);
  const [windowWidth, windowHeight] = useWindowSize();
  const { offset, width } = useContainerPosition(containerRef, [
    windowWidth,
    windowHeight,
  ]);
  const positioner = usePositioner(
    { width, columnWidth: 320, columnGutter: 10 },
    // This is our dependencies array. When these dependencies
    // change, the positioner cache will be cleared and the
    // masonry component will reset as a result.
    [files]
  );

  const resizeObserver = useResizeObserver(positioner);
  return (
    <div
      className={[style.container, 'arrangement'].join(" ")}
      css={css`
        --padding-top: ${top}px;
      `}
      ref={containerRef}
    >
      {files.size > 0 ? (
        <MasonryScroller
          positioner={positioner}
          resizeObserver={resizeObserver}
          items={Array.from(files).map((el) => el[1])}
          height={windowHeight}
          offset={offset}
          render={Card}
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

  return (
    <div key={data.id} className={style.card}>
      {location?.pathname.includes("/profile") &&
      profile?.from === "profile-own" ? (
        <PostCard
          data={data}
          size={320}
          cancel={true}
          like={
            <Like
              likes={data?.like[0]?.count}
              liked={data?.liked}
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
              liked={data?.liked}
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
          if (image !== null) {
            return acc.set(image.id, image);
          } else return acc;
        }, new Map<string, TPostCardData>());
      } else return new Map<string, TPostCardData>();
    })[0];
}
function currentCache(cacheKey: string) {
  return [cacheKey]
    .map((key) => sessionStorage.getItem(key))
    .map((cacheStr) => {
      if (cacheStr !== null) return initMap(cacheKey);
      else return null;
    })
    .map((map) => {
      if (map !== null) {
        return Array.from(map).map((el) => el[1]);
      } else return [] as Array<TPostCardData>;
    })[0];
}

export default Arrangement;
