import { create, State, StateCreator, StoreMutatorIdentifier } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";
import { TPostCardData } from "../component/ui/PostCard";
import { fetchMoreInfo, fetchImages } from "./fetch";
import { IProfile } from "../component/composite/Profile";
import { ILoading } from "../pages";

type Logger = <
  T extends unknown,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T extends unknown>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>;
  const loggedSet: typeof set = (...a) => {
    set(...a);
    console.log(...(name ? [`${name}:`] : []), get());
  };
  store.setState = loggedSet;

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;

///////////////////////////////////////////////////////////////////////////////////////
type TState = {
  themeMode: "light" | "dark";
  i18n: string;
  isAuth: boolean;
  token: string;
  statics: { limit: number; uploaded: number };
  deletingIds: Array<string>;
  tab: boolean;
  deleted: boolean;
};
type Action = {
  reset: () => void;
  toggleTheme: (newTheme: "light" | "dark") => void;
  changeI18n: (newI18n: string) => void;
  setAuth: (newAuth: boolean) => void;
  setToken: (newToken: string) => void;
  setInitStatics: () => void;
  setStatics: (statics: { limit: number; uploaded: number }) => void;
  setDeletingIds: (deletingIds: Array<string>) => void;
  toggleTab: (newTab: boolean) => void;
  setDeleted: (newDeleted: boolean) => void;
};

const initialState: TState = {
  themeMode: "light",
  i18n: import.meta.env.VITE_DEFAULT_LACALE ?? "en",
  isAuth: false,
  token: "",
  statics: { limit: 0, uploaded: 0 },
  deletingIds: [],
  tab: true,
  deleted: false,
};

export const useStore = create<
  TState & Action,
  [
    ["zustand/subscribeWithSelector", never],
    ["zustand/persist", Omit<TState & Action, "deletingIds">]
  ]
>(
  logger(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          ...initialState,
          reset: () => {
            set(initialState);
          },
          toggleTheme: (newTheme) => set(() => ({ themeMode: newTheme })),
          changeI18n: (newI18n) => set(() => ({ i18n: newI18n })),
          setAuth: (newAuth) => set(() => ({ isAuth: newAuth })),
          setToken: (newToken) => set(() => ({ token: newToken })),
          setInitStatics: async () => {
            const token = get().token;
            const data = (await fetchMoreInfo(token)) as {
              limit: number;
              uploaded: number;
            };
            set(() => ({ statics: data }));
          },
          setStatics: (newStatics) => set(() => ({ statics: newStatics })),
          setDeletingIds: (newDeletingIds) =>
            set(() => ({ deletingIds: newDeletingIds })),
          toggleTab: (newTab) => set(() => ({ tab: newTab })),
          setDeleted: (newDeleted) => set(() => ({ deleted: newDeleted })),
        }),
        {
          name: "app-storage",
          // @ts-ignore
          storage: createJSONStorage(() => sessionStorage),
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) => !["deletingIds", "tab"].includes(key)
              )
            ),
        }
      )
    )
  )
);
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
export const createSesssion = (data: any) => {
  sessionStorage.setItem("user", JSON.stringify((data as any).user));
  sessionStorage.setItem("publicToken", (data as any).publicToken);
  sessionStorage.setItem("locale", (data as any).locale);
};

export const clearSession = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("publicToken");
  sessionStorage.removeItem("file-data");
  sessionStorage.removeItem("profile-own");
  sessionStorage.removeItem("profile-like");
};
