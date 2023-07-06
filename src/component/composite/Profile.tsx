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

export interface IProfile {
  data: TEventData;
  ids: Array<string>;
  setIds: React.Dispatch<React.SetStateAction<string[]>>;
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
  //indicate which tab, upload or like
  const [toggle, setToggle] = React.useState(true);
  const [ids, setIds] = React.useState<Array<string>>([]);
  const [fetchComplete, setFetchComplete] = React.useState<boolean>(false);

  const user = sessionStorage.getItem("user");

  const avatar = user ? JSON.parse(user).avatar : "/avatar.svg";
  const name = user ? JSON.parse(user).name : "";
  const email = user ? JSON.parse(user).email : "";
  const limit = user ? JSON.parse(user).limit : 5;
  const userId = user ? `publicUser:${JSON.parse(user).publicUser}` : "";
  const [token, _] = React.useState<string | null>(
    sessionStorage.getItem("token")
  );

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
        sessionStorage.setItem("file-data", JSON.stringify(res.data));
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
      sessionStorage.setItem("file-data", JSON.stringify(likeEvent));
    };
    sse.onerror = (error) => {
      console.log(error);
    };
    return () => {
      sse.close();
      setIds([]);
    };
  }, []);

  return (
    <div className={style.profileCard}>
      <div className={style.top}>
        <ProfileCard userinfo={{ avatar, name, email, limit }} />
        <div className={style.followers}>
          <Follower
            size={100}
            icon={<FiUploadCloud />}
            data={{ name: "上传", value: data.uploaded }}
            onClick={() =>
              startTransition(() => {
                setToggle(true);
                setFetchComplete(false);
              })
            }
          />
          <Follower
            size={100}
            icon={<FiHeart />}
            data={{ name: "点赞", value: data.likes }}
            onClick={() =>
              startTransition(() => {
                setToggle(false);
                setFetchComplete(false);
              })
            }
          />
          <Follower
            size={100}
            icon={<FiHeart />}
            data={{ name: "获赞", value: data.liked }}
          />
        </div>
      </div>
      <ProfileContext.Provider
        value={{
          data,
          ids: ids,
          setIds: setIds,
          from: `profile-${toggle ? "own" : "like"}`,
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
                      setToggle(true);
                      setFetchComplete(false);
                    })
                  )
                }
              >
                上传
              </Button>,
              <Button
                key={`button_2`}
                onClick={() =>
                  startTransition(() =>
                    startTransition(() => {
                      setToggle(false);
                      setFetchComplete(false);
                    })
                  )
                }
              >
                点赞
              </Button>,
            ]}
          </ButtonGroup>
          <LoadingContext.Provider value={{ fetchComplete, setFetchComplete }}>
            {toggle ? (
              <Arrangement
                width={300}
                top={10}
                query={(records, current) =>
                  `select *, (select * from $parent.publicUser) as user, ((select count() from publicUser where ->like->(presignedImage where id=$parent.id) group all) || [{count: 0}]) as like from presignedImage where publicUser='${userId}' and "${current}" < (expiredTime - 2h) order by expiredTime, name limit 16 start ${records};`
                }
              />
            ) : (
              <LaterArrangement userId={userId} />
            )}
            {!fetchComplete ? <Spin size={10} /> : null}
          </LoadingContext.Provider>
          {ids.length > 0 && toggle ? (
            <Button
              variant="contained"
              color="error"
              className={style.delete}
              startIcon={<FiTrash2 />}
              onClick={() => {
                console.log("start to delete images");
                axios({
                  url: `${API_URL}/api/files`,
                  method: "DELETE",
                  data: {
                    "files": ids,
                  },
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                })
                  .then((res) => {
                    console.log(res.status);
                    if (res.status === 200) {
                      const limit = parseInt(
                        JSON.parse(sessionStorage.getItem("statics")!).limit
                      );
                      const uploaded = parseInt(
                        JSON.parse(sessionStorage.getItem("statics")!).uploaded
                      );
                      sessionStorage.setItem(
                        "statics",
                        JSON.stringify({
                          limit,
                          uploaded: uploaded - ids.length,
                        })
                      );
                      setData({...data, uploaded});
                      //files in Arrangement and cache
                    }
                  })
                  .catch((err) => console.log(err))
                  .finally(() => setIds([]));
              }}
            >
              Delete
            </Button>
          ) : null}
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
          width={300}
          top={10}
          query={(records, current) =>
            `select *, (select * from $parent.publicUser) as user, ((select count() from publicUser where ->like->(presignedImage where id=$parent.id) group all) || [{count: 0}]) as like from fn::liking_images(${userId}) where "${current}" < (expiredTime - 2h) order by expiredTime, name limit 16 start ${records};`
          }
        />
      ) : null}
    </Fragment>
  );
}

export default ProfileComponent;
