export const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.STORYBOOK_API_URL ?? import.meta.env.VITE_DEV_API_URL
    : `${window.location.protocol}//${window.location.host}`;

export const TOKEN =
  import.meta.env.MODE === "development"
    ? import.meta.env.STORYBOOK_API_KEY ?? sessionStorage.getItem("token")
    : sessionStorage.getItem("token");

export const PUBLIC_TOKEN =
  import.meta.env.MODE === "development"
    ? import.meta.env.STORYBOOK_PUBLIC_TOKEN ??
    sessionStorage.getItem("publicToken")
    : sessionStorage.getItem("publicToken");

export const DB_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.STORYBOOK_DB_URL ?? import.meta.env.VITE_DEV_DB_URL
    : import.meta.env.VITE_DB_URL;

export const AVATAR_API =
  import.meta.env.MODE === "development"
    ? import.meta.env.STORYBOOK_AVATAR_API ?? import.meta.env.VITE_AVATAR_API
    : import.meta.env.VITE_AVATAR_API;

export const URL_HOME = 
  import.meta.env.MODE === "development"
  ? import.meta.env.STORYBOOK_URL ?? import.meta.env.VITE_DEV_URL
  : import.meta.env.VITE_URL;

export const AUTH_URL = 
  import.meta.env.MODE === "development"
  ? import.meta.env.STORYBOOK_AUTH_URL ?? import.meta.env.VITE_DEV_AUTH_URL
  : import.meta.env.VITE_AUTH_URL;