import React from "react";

const MatchForm = React.memo(({ handleFormSubmit }) => {
  return (
    <form className="create" onSubmit={handleFormSubmit}>
      <img src={process.env.PUBLIC_URL + `/mainIcon.svg`} alt="로고" />
      <div>
        <label htmlFor="blue_team_name">Blue team name</label>
        <input
          type="text"
          id="blue_team_name"
          name="blue_team_name"
          maxLength="30"
        />
        <label htmlFor="red_team_name">Red team name</label>
        <input
          type="text"
          id="red_team_name"
          name="red_team_name"
          maxLength="30"
        />
        <label htmlFor="match_name">Match name</label>
        <input type="text" id="match_name" name="match_name" maxLength="30" />
      </div>
      <button type="submit" className="confirm">
        Confirm
      </button>
    </form>
  );
});

export default MatchForm;
