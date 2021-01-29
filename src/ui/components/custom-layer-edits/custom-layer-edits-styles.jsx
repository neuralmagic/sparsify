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

export default function makeCustomLayerEditsStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FAF2CE",
          padding: theme.spacing(1),
          marginTop: theme.spacing(1),
          marginBottom: theme.spacing(1),
          color: theme.palette.text.disabled,
        },
        text: {
          fontSize: 14,
        },
        button: {
          textTransform: "none",
          fontSize: 14,
        },
      };
    },
    { name: "CustomLayerEdits" }
  );
}
