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

export default function makeDisplayEpochRangeStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          display: "flex",
          flexDirection: "column",
        },
        label: {
          marginBottom: theme.spacing(2),
        },
        range: {
          display: "flex",
          alignItems: "center",
        },
        dash: {
          width: theme.spacing(3),
          height: "2px",
          backgroundColor: theme.palette.divider,
        },
      };
    },
    { name: "DisplayEpochRange" }
  );
}
