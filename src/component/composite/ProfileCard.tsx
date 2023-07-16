//应用
import React, { useRef } from "react";
//style
import style from "./ProfileCard.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import Avatar from "../ui/Avatar";

type TProfileCard = {
  /**
   * userinfo
   */
  userinfo: {
    avatar: string;
    email: string;
    limit: number;
    name: string;
  };
  /**
   * modal
   */
  modal?: React.ReactNode;
  /**
   * content i18n
   */
  content: Record<string, string>;
  /**
   * size
   */
  size: { iconSize: number; fontSize: number };
};

function ProfileCard({ userinfo, ...props }: TProfileCard) {
  return (
    <div className={style.container}>
      {
        <Avatar
          size={props.size.iconSize}
          id="card-avatar"
          iconUrl={userinfo?.avatar}
        />
      }
      <div
        className={style.main}
        css={css`
          --avatar-font-size: ${props.size.fontSize}px;
        `}
      >
        <div className={style.name}>
          <p>{props.content.name}</p>
          <p>{userinfo?.name}</p>
        </div>
        <div className={style.email}>
          <p>{props.content.email}</p>
          <p>{userinfo?.email}</p>
        </div>
        <div>
          <p>{`${props.content.limit}: ${userinfo?.limit}`}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
