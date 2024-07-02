import { useRef } from "react";

export default function OpacityImage(props) {
  const ref = useRef();

  setTimeout(() => {
    if (ref.current) {
      ref.current.style.opacity = 1;
    }
  }, [props.duration]);

  switch (props.type) {
    case "show":
      return (
        <img
          ref={ref}
          alt="챔피언 이미지"
          src={props.src}
          style={{
            opacity: 0,
            transition: "opacity 0.2s ease-in-out",
            top: 0,
            left: 0,
          }}
        ></img>
      );

    case "hide":
      return <div></div>;

    default:
      break;
  }
}
