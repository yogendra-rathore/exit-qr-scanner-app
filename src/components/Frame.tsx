import React from "react";

type Props = {
  withScanBar?: boolean;
  style?: React.CSSProperties;
};

export default function Frame({ withScanBar, style }: Props) {
  return (
    <div className="frame" style={style}>
      <div className="corner tl" />
      <div className="corner tr" />
      <div className="corner bl" />
      <div className="corner br" />
      <div className="scanbar">
        {withScanBar && <div className="scanline" />}
      </div>
    </div>
  );
}
