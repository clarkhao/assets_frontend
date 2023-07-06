//应用
import React, { Fragment } from "react";
import { useStore } from "../../store";
import { AuthConfig, sdk } from "../../component/utils";
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

function Frame() {
  const handleClick = () => {
    const url = sdk.getSigninUrl();
    window.location.href = url;
  };
  const isAuth = useStore((state) => state.isAuth);
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");
  const publicToken = sessionStorage.getItem("publicToken");
  const authenticated = isAuth && !!token && !!user && !!publicToken;

  const location = useLocation();
  const currentOutlet = useOutlet();
  const [toggleEnter, setToggleEnter] = React.useState(false);

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
              window.location.href = "/";
            }}
          />
        }
        rightOne={<Selector size={60} offsetY={26} />}
        rightTwo={<ThemeToggle size={60} />}
        isAuth={authenticated}
        handleClick={handleClick}
      />
      <div
        className={[
          style.original,
          toggleEnter ? style.page : "",
        ].join(" ")}
      >
        {currentOutlet}
      </div>
    </Fragment>
  );
}

export default Frame;
