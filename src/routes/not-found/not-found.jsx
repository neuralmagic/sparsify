import React, { useEffect } from "react";

import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import GenericPage from "../../components/generic-page";
import { useHistory } from "react-router-dom";

function NotFound() {
  const history = useHistory();

  useEffect(() => {
    if (history.location.pathname !== "/not-found") {
      history.replace("/not-found");
    }
  }, [history]);

  return (
    <GenericPage
      title="Page not found"
      description="The page you are looking for does not exist."
      logoComponent={<SentimentVeryDissatisfiedIcon />}
    />
  );
}

export default NotFound;
