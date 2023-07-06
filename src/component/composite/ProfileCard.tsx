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
};

function ProfileCard({ userinfo,...props }: TProfileCard) {
  return (
    <div className={style.container}>
      {<Avatar size={150} id="card-avatar" iconUrl={userinfo?.avatar}/>}
      <div className={style.main}>
        <div className={style.name}>
          <h3>Name</h3>
          <p>{userinfo?.name}</p>
        </div>
        <div className={style.email}>
          <p>Email</p>
          <p>{userinfo?.email}</p>
        </div>
        <div>
          <p>Limit: {userinfo?.limit}</p>
        </div>
      </div>
      
    </div>
  );
}

export default ProfileCard;
