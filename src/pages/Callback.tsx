/** @jsxImportSource @emotion/react */
//应用模块
import React, { Fragment } from "react";
import { AuthConfig, sdk, API_URL } from "../component/utils";
//style
import style from "./Callback.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
//hooks
import { useStore, createSesssion, clearSession } from "../store";
import ErrorBoundary from "../component/ui/ErrorBoundary";
//组件
import Spin from "../component/ui/Spin";
import { AUTH_URL } from "../component/utils/config";

function CallbackComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuth, setAuth] = useStore((state) => [state.isAuth, state.setAuth]);
  const navigate = useNavigate();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const handleCallback = () => {

    fetch(`${API_URL}/api/signin?code=${code}&state=${state}`, {
      method: "POST",
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log(res.status);
          throw new Error("failed to sign in");
        }
      })
      .then((data) => {
        createSesssion(data);
        setAuth(true);
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
        throw new Error("authenticate failed");
      });
      
  };
  let count = 0;
  React.useEffect(() => {
    if (window.location.href.indexOf("code") !== -1) {
      count++;
      if (count < 2) {
        handleCallback();
      }
    } else {
      console.log(window.location.href);
      throw new Error(window.location.href);
    }
  }, []);

  return (
    <div className={style.callback}>
      <Spin size={15} />
      <p>登录中...</p>
    </div>
  );
}

const Callback = () => {
  const themeMode = useStore((state) => state.themeMode);
  return (
    <div className={`${themeMode}-container`}>
      <ErrorBoundary>
        <CallbackComponent />
      </ErrorBoundary>
    </div>
  );
};

export default Callback;
