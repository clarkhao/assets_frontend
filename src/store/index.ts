import { create } from "zustand";
import type { Theme } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../component/utils";
import { persist } from "zustand/middleware";

type State = {
  themeMode: "light" | "dark";
  i18n: string;
  isAuth: boolean;
};
type Action = {
  toggleTheme: (newTheme: "light" | "dark") => void;
  changeI18n: (newI18n: string) => void;
  setAuth: (newAuth: boolean) => void;
};
export const useStore = create<
  State & Action,
  [["zustand/persist", State & Action]]
>(
  persist(
    (set) => ({
      themeMode: "light",
      i18n: "en",
      isAuth: false,
      toggleTheme: (newTheme) => set(() => ({ themeMode: newTheme })),
      changeI18n: (newI18n) => set(() => ({ i18n: newI18n })),
      setAuth: (newAuth) => set(() => ({ isAuth: newAuth })),
    }),
    {
      name: "app-storage",
    }
  )
);

export const createSesssion = (data: any) => {
  sessionStorage.setItem("token", (data as any).token);
  sessionStorage.setItem("user", JSON.stringify((data as any).user));
  sessionStorage.setItem("publicToken", (data as any).publicToken); 
};

export const clearSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("publicToken");
  sessionStorage.removeItem("statics");
  sessionStorage.removeItem("file-data");
  sessionStorage.removeItem("profile-own");
  sessionStorage.removeItem("profile-like");
};
