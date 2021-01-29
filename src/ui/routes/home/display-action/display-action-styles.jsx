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

export default function makeDisplayActionStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          height: "fit-content",
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2),
          maxWidth: "256px",
        },
        content: {
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
        },
        icon: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          "& svg": {
            height: "128px",
            width: "128px",
            fill: theme.palette.primary.main,
          },
        },
        divider: {
          marginTop: theme.spacing(3),
          width: `calc(100% + ${theme.spacing(6)}px)`,
          marginLeft: -1 * theme.spacing(3),
        },
        header: {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(1),
        },
      };
    },
    { name: "DisplayAction" }
  );
}
