import React from "react";
import { useRef } from "react";

const OpacityImage = React.memo(({ duration, src }) => {
  const ref = useRef();

  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.transition = "";
      ref.current.style.opacity = 0;
    }

    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.style.transition = "opacity 0.2s ease-in-out";
        ref.current.style.opacity = 1;
      }
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, src]);

  return (
    <img
      ref={ref}
      alt="챔피언 이미지"
      src={src}
      style={{
        opacity: 0,
        top: 0,
        left: 0,
      }}
    ></img>
  );
});

export default OpacityImage;
