//应用
import React, { Fragment } from "react";
import { useStore } from "../../store";
import { AuthConfig, sdk, API_URL } from "../../component/utils";
import axios from "axios";
//style
import style from "./Frame.module.css";
import { lightTheme, darkTheme } from "../utils";
//组件
import ThemeToggle from "../ui/ThemeToggle";
import Selector from "../ui/Selector";
import Logo from "../ui/Logo";
import TopBar from "./TopBar";
import ThemeFrame from "./ThemeFrame";
//hooks
import { useLocation, useOutlet } from "react-router-dom";
import { Button } from "@mui/material";
import { FiTrash2 } from "react-icons/fi";
import { TPostCardData } from "../ui/PostCard";
import { getDictionary } from "../../i18n";

function Frame() {
  const handleClick = () => {
    const url = sdk.getSigninUrl();
    window.location.href = url;
  };
  const [
    isAuth,
    token,
    i18n,
    setInitStatics,
    deletingIds,
    tab,
    statics,
    setStatics,
    setDeleted,
  ] = useStore((state) => [
    state.isAuth,
    state.token,
    state.i18n,
    state.setInitStatics,
    state.deletingIds,
    state.tab,
    state.statics,
    state.setStatics,
    state.setDeleted,
  ]);
  const user = sessionStorage.getItem("user");
  const authenticated = isAuth && !!token && !!user;

  const location = useLocation();
  const currentOutlet = useOutlet();
  const [toggleEnter, setToggleEnter] = React.useState(false);

  const content = getDictionary(i18n as "jp" | "en" | "cn").delete as string;

  React.useEffect(() => {
    if (location.pathname === "/") {
      window.location.href = `/${i18n}`;
    }
    if (token && token !== "") {
      setInitStatics();
    }
  }, [token]);
  React.useEffect(() => {
    setToggleEnter(!toggleEnter);
  }, [location.pathname]);

  return (
    <Fragment>
      <TopBar
        left={
          <Logo
            size={40}
            clickHandler={() => {
              window.location.href = `/${i18n}`;
            }}
          />
        }
        rightOne={<Selector size={60} offsetY={26} />}
        rightTwo={<ThemeToggle size={60} />}
        isAuth={authenticated}
        handleClick={handleClick}
      />
      <div
        className={[style.original, toggleEnter ? style.page : ""].join(" ")}
      >
        {currentOutlet}
      </div>
      {deletingIds.length > 0 && tab ? (
        <Button
          variant="contained"
          color="error"
          startIcon={<FiTrash2 />}
          style={{ position: "fixed", left: "calc(50% - 50px)", bottom: 0 }}
          onClick={() => {
            axios({
              url: `${API_URL}/api/files`,
              method: "DELETE",
              data: {
                files: deletingIds,
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            })
              .then((res) => {
                if (res.status === 200) {
                  const user = JSON.parse(sessionStorage.getItem("user")!);
                  const uploaded = statics.uploaded;

                  //files in Arrangement and cache
                  const cache = ["index-file"];
                  cache
                    .map((key) => sessionStorage.getItem(key))
                    .map((storage) => {
                      if (storage !== null) {
                        return JSON.parse(storage) as Array<TPostCardData>;
                      } else return null;
                    })
                    .forEach((list, index) => {
                      if (list !== null) {
                        const newList = list.filter(
                          (el) => !deletingIds.some((id) => id === el.id)
                        );
                        const updatedStr = JSON.stringify(newList);
                        sessionStorage.setItem(cache[index], updatedStr);
                      }
                    });
                  setStatics({
                    ...statics,
                    uploaded: uploaded - deletingIds.length,
                  });
                }
              })
              .catch((err) => console.log(err))
              .finally(() => {
                setDeleted(true);
              });
          }}
        >
          {content}
        </Button>
      ) : null}
    </Fragment>
  );
}

export default Frame;
