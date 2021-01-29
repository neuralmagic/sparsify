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

export default function makeProjectStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          padding: theme.spacing(4),
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        warning: {
          flex: "1 0",
        },
        button: {
          width: "192px",
          padding: theme.spacing(2),

          color: theme.palette.error.contrastText,
          backgroundColor: theme.palette.error.main,
          "&:hover": {
            backgroundColor: theme.palette.error.dark,
          },
        },
      };
    },
    { name: "Project" }
  );
}
