import React from "react";

type TFileData = {
  uploaded: number;
  likes: number;
  liked: number;
}
type TProfileState = {
  fileData: TFileData;
  tabToggle: boolean;
  deleleIds: Array<string>;
}
type TProfilePayload = {
  "set-data": TFileData;
  "set-tab-toggle": boolean;
  "set-delete-ids": Array<string>;
}