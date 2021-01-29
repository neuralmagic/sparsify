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

import { makeStyles } from "@material-ui/core/styles";

export default function makeBackgroundSectionStyles() {
  return makeStyles(
    (theme) => {
      return {
        backgroundSection: {
          position: "relative",
          display: "flex",
          justifyContent: "center",
        },
        backgroundSectionLabelContainer: {
          position: "absolute",
          bottom: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        backgroundSectionLabel: {
          fontSize: "0.7rem",
        },
        backgroundSectionLabelTick: {
          width: "1px",
          height: theme.spacing(1),
          backgroundColor: theme.palette.divider,
        },
        backgroundSectionFill: {
          flex: "1 0",
        },
      };
    },
    { name: "BackgroundSection" }
  );
}
