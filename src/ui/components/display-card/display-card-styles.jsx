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

export default function makeDisplayCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          position: "relative",
          height: "360px",
          overflow: "unset",
        },
        content: {
          position: "relative",
          height: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          display: "flex",
          flexDirection: "row",
          padding: theme.spacing(3),
        },
        actionButtons: {
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          top: theme.spacing(2),
          right: theme.spacing(2),
        },
        actionButton: {
          marginLeft: theme.spacing(1),
        },
      };
    },
    { name: "DisplayCard" }
  );
}
