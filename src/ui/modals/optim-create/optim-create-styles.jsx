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

export default function createOptimStyles() {
  return makeStyles(
    (theme) => {
      return {
        disabledText: {
          color: theme.palette.text.disabled,
        },
        cancelButton: {
          color: theme.palette.text.secondary,
        },
        inputFields: {
          margin: theme.spacing(1, 2, 1, 0),
        },
        dialog: {
          width: "600px",
          overflowY: "hidden",
          height: "530px",
          padding: theme.spacing(2),
        },
        hidden: {
          visibility: "hidden",
        },
        loaderText: {
          marginTop: theme.spacing(3),
        },
        loaderContainer: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        noPresetsLabel: {
          verticalAlign: "middle",
        },
        tabContainer: {
          padding: theme.spacing(2, 0, 4),
          height: "30vh",
        },
        transitionGroup: {
          height: "100%",
        },
      };
    },
    { name: "CreateOptim" }
  );
}
