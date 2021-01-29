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

export default function makeModifierRowStyles() {
  return makeStyles(
    (theme) => {
      return {
        modifier: {
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: theme.spacing(3),
          zIndex: 1,
        },
        modifierLabelContainer: {
          position: "absolute",
          left: 0,
          height: "100%",
        },
        modifierLabelWrapper: {
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "center",
        },
        modifierLabel: {
          position: "absolute",
          right: theme.spacing(3),
        },
        modifierBackground: {
          width: "100%",
          height: theme.spacing(0.5),
          backgroundColor: theme.palette.divider,
        },
        modifierActive: {
          height: "100%",
          backgroundColor: theme.palette.primary.main,
        },
      };
    },
    { name: "ModifierRow" }
  );
}
