import "../../assets/default/default.css";
import { baseUrl } from "../../helper/port";

export default function MainView(props) {
  if (props.setting) {
    return (
      <div className="create">
        <img src={process.env.PUBLIC_URL + `/mainIcon.svg`} alt="로고" />
        <label htmlFor="blue_team_name">Blue Team Link</label>
        <input
          type="text"
          id="blue_team_name"
          readOnly
          value={`${baseUrl}/draft/${props.draftSeq}/${props.blueEnName}`}
        />
        <label htmlFor="red_team_name">Red Team Link</label>
        <input
          type="text"
          id="red_team_name"
          readOnly
          value={`${baseUrl}/draft/${props.draftSeq}/${props.redEnName}`}
        />
        <label htmlFor="red_team_name">Watch Team Link</label>
        <input
          type="text"
          id="watch_team_name"
          readOnly
          value={`${baseUrl}/draft/${props.draftSeq}/${props.watchEnName}`}
        />
      </div>
    );
  }

  return (
    <form className="create" onSubmit={props.handleFormSubmit.bind(this)}>
      <img src={process.env.PUBLIC_URL + `/mainIcon.svg`} alt="로고" />
      <div>
        <label htmlFor="blue_team_name">Blue team name</label>
        <input
          type="text"
          id="blue_team_name"
          ref={props.firstInputRef}
          onChange={(event) => props.setBlueName(event.target.value)}
          maxLength="30"
        />
        <label htmlFor="red_team_name">Red team name</label>
        <input
          type="text"
          id="red_team_name"
          maxLength="30"
          onChange={(event) => props.setRedName(event.target.value)}
        />
        <label htmlFor="match_name">Match name</label>
        <input
          type="text"
          id="match_name"
          maxLength="30"
          onChange={(event) => props.setMatchName(event.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={props.submitDisabled ? "disabled" : ""}
        className="confirm"
      >
        Confirm
      </button>
    </form>
  );
}
