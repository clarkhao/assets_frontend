/**
 * upload types
 */
export type TFileListType = {
  id: string;
  file: File;
  //"", "F", "S"
  status: {upload: string; write: string;};
  progress: number;
};
export type TFileErrMsgType = {
  name: string;
  msg: string[];
};

//i18n data for signup page
export type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray
  | null;
export type JsonObject = { [Key in string]?: JsonValue };
export interface JsonArray extends Array<JsonValue> {}

export type TPresignedUploadUrl = { name: string; url: string };

export type TPresignedImage = {
  id: string;
  expiredTime: string;
  updatedTime: string;
  userId: string;
  url: string;
};
