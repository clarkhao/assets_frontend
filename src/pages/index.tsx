/** @jsxImportSource @emotion/react */
//应用模块
import React from "react";
import { AuthConfig, sdk } from "../component/utils";
//style
import style from "./index.module.css";
import { useTheme } from "@mui/material/styles";
import { css } from "@emotion/react";
//组件
import Arrangement from "../component/composite/Arrangement";
import Frame from "../component/layout/Frame";
import Spin from "../component/ui/Spin";
//hooks
import { useStore } from "../store";
import JumpButton from "../component/ui/Button";
import ErrorBoundary from "../component/ui/ErrorBoundary";
import ThemeFrame from "../component/layout/ThemeFrame";

export interface ILoading {
  fetchComplete: boolean;
  setFetchComplete: React.Dispatch<React.SetStateAction<boolean>>;
}
export const LoadingContext = React.createContext<ILoading | null>(null);
type THome = {};

function Home({ ...props }: THome) {
  const theme = useTheme();
  const [themeMode, i18n] = useStore((state) => [state.themeMode, state.i18n]);
  const [fetchComplete, setFetchComplete] = React.useState<boolean>(false);
  const [isExiting, setIsExiting] = React.useState<boolean>(false);
  const [timer, setTimer] = React.useState<number>(0);

  return (
    <div
      className={[
        style.container,
        isExiting ? style.exiting : "",
        `${themeMode}-container`,
      ].join(" ")}
      css={css`
        background-color: ${theme.palette.background.default};
      `}
    >
      <div className={style.button}>
        <JumpButton
          handleClick={() => {
            setIsExiting(true);
            setTimer(
              window.setTimeout(() => {
                window.location.href = `/${i18n}/upload`;
              }, 300)
            );
          }}
        />
      </div>
      <LoadingContext.Provider value={{ fetchComplete, setFetchComplete }}>
        <Arrangement arrageWidth={300} top={170} />
        {!fetchComplete ? <Spin size={10} /> : null}
      </LoadingContext.Provider>
    </div>
  );
}

export default Home;
