import React from "react";

import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import GenericPage from "../../components/generic-page";

function NotFound() {
  return <GenericPage
    title="Page not found"
    description="The page you are looking for doesn't exist or an other error occured."
    logoComponent={<SentimentVeryDissatisfiedIcon/>}
  />;
}

export default NotFound;
