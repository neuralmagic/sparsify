/*
Copyright 2021-present Neuralmagic, Inc.

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

import { makeStyles } from "@material-ui/core/styles";

export default function makeTrainingSummaryCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          height: "fit-content",
        },
        rowsLayout: {
          flex: "1 0",
          paddingLeft: "192px",
          paddingTop: theme.spacing(4),
          paddingBottom: theme.spacing(4),
        },
        rows: {
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
        },
        rowsXLabel: {
          position: "absolute",
          top: `calc(100% + ${theme.spacing(2.5)}px)`,
          fontSize: "0.7rem",
        },
      };
    },
    { name: "TrainingSummaryCard" }
  );
}
