import React from "react";
import { useRef } from "react";

const OpacityImage = React.memo(({ duration, src }) => {
  const ref = useRef();

  setTimeout(() => {
    if (ref.current) {
      ref.current.style.opacity = 1;
    }
  }, [duration]);

  return (
    <img
      ref={ref}
      alt="챔피언 이미지"
      src={src}
      style={{
        opacity: 0,
        transition: "opacity 0.2s ease-in-out",
        top: 0,
        left: 0,
      }}
    ></img>
  );
});

export default OpacityImage;
