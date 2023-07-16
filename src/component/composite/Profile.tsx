//应用
import React, { Fragment, useRef } from "react";
import EventSource from "eventsource";
import { API_URL } from "../utils";
import axios from "axios";
//style
import style from "./Profile.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import ProfileCard from "./ProfileCard";
import Follower from "../ui/Follower";
import Arrangement from "./Arrangement";
import { FiUploadCloud, FiHeart } from "react-icons/fi";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Spin from "../ui/Spin";
import { LoadingContext } from "../../pages/index";
import { FiTrash2 } from "react-icons/fi";
import { TPostCardData } from "../ui/PostCard";
import { getDictionary } from "../../i18n";
import { useStore } from "../../store";
//hooks
import { useMediaQuery } from "react-responsive";

export interface IProfile {
  data: TEventData;
  from: string;
}
//PostCard, Arrangement
export const ProfileContext = React.createContext<IProfile | null>(null);

type TProfile = {};
type TEventData = {
  uploaded: number;
  likes: number;
  liked: number;
};

function ProfileComponent({ ...props }: TProfile) {
  const [isPending, startTransition] = React.useTransition();
  const [data, setData] = React.useState<TEventData>({
    uploaded:
      sessionStorage.getItem("file-data") === null
        ? 0
        : parseInt(JSON.parse(sessionStorage.getItem("file-data")!).uploaded),
    likes:
      sessionStorage.getItem("file-data") === null
        ? 0
        : parseInt(JSON.parse(sessionStorage.getItem("file-data")!).likes),
    liked:
      sessionStorage.getItem("file-data") === null
        ? 0
        : parseInt(JSON.parse(sessionStorage.getItem("file-data")!).liked),
  });

  const [fetchComplete, setFetchComplete] = React.useState<boolean>(false);
  const [deleted, setDeleted] = React.useState<boolean>(false);

  const user = sessionStorage.getItem("user");
  const [
    i18n,
    token,
    statics,
    setStatics,
    deletingIds,
    setDeletingIds,
    tab,
    toggleTab,
  ] = useStore((state) => [
    state.i18n,
    state.token,
    state.statics,
    state.setStatics,
    state.deletingIds,
    state.setDeletingIds,
    state.tab,
    state.toggleTab,
  ]);

  const avatar = user ? JSON.parse(user).avatar : "/avatar.svg";
  const name = user ? JSON.parse(user).name : "";
  const email = user ? JSON.parse(user).email : "";
  const limit = statics.limit;
  const userId = user ? `publicUser:${JSON.parse(user).id}` : "";

  const content = getDictionary(i18n as "jp" | "en" | "cn").profile as Record<
    string,
    any
  >;

  const isDesktop = useMediaQuery({ minWidth: 1224 });

  const isTablet = useMediaQuery({ maxWidth: 1224, minWidth: 480 });

  const isMobile = useMediaQuery({ maxWidth: 480 });
  const getStyle = () => {
    switch (true) {
      case isDesktop:
        return { follow: 100, avatar: { iconSize: 150, fontSize: 18 } };
      case isTablet:
        return { follow: 60, avatar: { iconSize: 100, fontSize: 16 } };
      case isMobile:
        return { follow: 30, avatar: { iconSize: 60, fontSize: 12 } };
      default:
        return { follow: 30, avatar: { iconSize: 100, fontSize: 16 } };
    }
  };
  const size = getStyle() as {
    follow: number;
    avatar: { iconSize: number; fontSize: number };
  };
  React.useEffect(() => {
    axios({
      url: `${API_URL}/api/likes/${userId}`,
      method: "GET",
    })
      .then((res) => {
        startTransition(() => {
          setData((prev) => ({
            ...prev,
            uploaded: res.data.uploaded,
            likes: res.data.likes,
            liked: res.data.liked,
          }));
        });
        setStatics({ limit: res.data.limit, uploaded: res.data.uploaded });
        sessionStorage.setItem(
          "file-data",
          JSON.stringify({
            uploaded: res.data.uploaded,
            likes: res.data.likes,
            liked: res.data.liked,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  React.useEffect(() => {
    const sse = new window.EventSource(
      `${API_URL}/api/likes/stream?user=${userId}`
    );
    sse.onmessage = (event) => {
      const likeEvent = JSON.parse(event.data);
      startTransition(() => {
        setData((prev) => ({
          ...prev,
          uploaded: likeEvent.uploaded,
          likes: likeEvent.likes,
          liked: likeEvent.liked,
        }));
      });
      setStatics({ limit: statics.limit, uploaded: likeEvent.uploaded });
      sessionStorage.setItem("file-data", JSON.stringify(likeEvent));
    };
    sse.onerror = (error) => {
      console.log(error);
    };
    return () => {
      sse.close();
    };
  }, []);

  return (
    <div className={style.profileCard}>
      <div className={style.top}>
        <ProfileCard
          userinfo={{ avatar, name, email, limit }}
          content={content.card}
          size={size.avatar}
        />
        <div className={style.followers}>
          <Follower
            size={size.follow}
            icon={<FiUploadCloud />}
            data={{ name: content.button.uploaded, value: data.uploaded }}
            onClick={() =>
              startTransition(() => {
                toggleTab(true);
                setFetchComplete(false);
              })
            }
            isColumn={isTablet || isMobile}
          />
          <Follower
            size={size.follow}
            icon={<FiHeart />}
            data={{ name: content.button.likes, value: data.likes }}
            onClick={() =>
              startTransition(() => {
                toggleTab(false);
                setFetchComplete(false);
              })
            }
            isColumn={isTablet || isMobile}
          />
          <Follower
            size={size.follow}
            icon={<FiHeart />}
            data={{ name: content.button.liked, value: data.liked }}
            isColumn={isTablet || isMobile}
          />
        </div>
      </div>
      <ProfileContext.Provider
        value={{
          data,
          from: `profile-${tab ? "own" : "like"}`,
        }}
      >
        <div className={style.main}>
          <ButtonGroup fullWidth>
            {[
              <Button
                key={`button_1`}
                onClick={() =>
                  startTransition(() =>
                    startTransition(() => {
                      toggleTab(true);
                      setFetchComplete(false);
                    })
                  )
                }
              >
                {content.button.uploaded}
              </Button>,
              <Button
                key={`button_2`}
                onClick={() =>
                  startTransition(() =>
                    startTransition(() => {
                      toggleTab(false);
                      setFetchComplete(false);
                    })
                  )
                }
              >
                {content.button.likes}
              </Button>,
            ]}
          </ButtonGroup>
          <LoadingContext.Provider value={{ fetchComplete, setFetchComplete }}>
            {tab ? (
              <Arrangement
                arrageWidth={300}
                top={10}
                query={(records) =>
                  `select *, (select * from $parent.publicUser) as user, ((select count() from publicUser where ->like->(presignedImage where id=$parent.id) group all) || [{count: 0}]) as like, (select count() from like where in=${userId} and out=$parent.id) as liked from presignedImage where publicUser='${userId}' order by createdTime, name limit 16 start ${records};`
                }
              />
            ) : (
              <LaterArrangement userId={userId} />
            )}
            {!fetchComplete ? <Spin size={10} /> : null}
          </LoadingContext.Provider>
        </div>
      </ProfileContext.Provider>
    </div>
  );
}

function LaterArrangement({ userId }: { userId: string }) {
  const [mounted, setMounted] = React.useState(true);
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    setMounted(false);
    setTimer(
      window.setTimeout(() => {
        setMounted(true);
      }, 500)
    );
    return () => clearTimeout(timer);
  }, []);
  return (
    <Fragment>
      {mounted ? (
        <Arrangement
          arrageWidth={300}
          top={10}
          query={(records) =>
            `select *, (select * from $parent.publicUser) as user, ((select count() from publicUser where ->like->(presignedImage where id=$parent.id) group all) || [{count: 0}]) as like from fn::liking_images(${userId}) order by createdTime, name limit 16 start ${records};`
          }
        />
      ) : null}
    </Fragment>
  );
}

export default ProfileComponent;
