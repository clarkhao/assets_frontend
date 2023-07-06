import { css } from "@emotion/react";

type TSkeleton = {
  /**
   * styles
   */
  style?: React.CSSProperties;
  /**
   * css in js
   */
  cssStr?: string;
};
function Skeleton({...props }: TSkeleton) {
  return (
    <>
      <div
        className="skeleton"
        style={props.style}
        css={css`
          ${props.cssStr}
        `}
      ></div>
    </>
  );
}

export default Skeleton;