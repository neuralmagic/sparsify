/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
