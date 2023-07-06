//应用
import React, { useRef } from "react";
//style
import style from "./AvatarList.module.css";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
//组件
import { AVATAR_API } from "../utils";
import Avatar from "./Avatar";

type TAvatarList = {
  
};

function AvatarList({ ...props }: TAvatarList) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  React.useEffect(() => {
    console.log(activeIndex);
  }, [activeIndex])
  return (
    <div className={style.avatarList}>
      {new Array(100).fill(0).map((item, index) => (
        <Avatar
          size={60}
          iconUrl={(index === activeIndex) ? `${AVATAR_API}?seed=${index}&backgroundColor=b6e3f4,c0aede,d1d4f9` : `${AVATAR_API}?seed=${index}`}
          key={`avatar_${index}`} 
          handleClick={() => {
            setActiveIndex(index);
          }}
        />
      ))}
    </div>
  );
}

export default AvatarList;
