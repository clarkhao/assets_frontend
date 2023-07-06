import Sdk from "casdoor-js-sdk";

export const AuthConfig = {
  serverUrl: "https://authen.clarkhao.repl.co",
  clientId: "a559f8c0836955ebb367",
  appName: "assets",
  organizationName: "portfolio",
  redirectPath: "/callback"
};

export const sdk = new Sdk(AuthConfig);
