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
import grey from "@material-ui/core/colors/grey";

export default function createExportStyles() {
  return makeStyles(
    (theme) => {
      return {
        contentHeader: {
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        },
        container: {
          height: "24vh",
          width: "770px",
          overflow: "hidden",
          position: "relative",
        },
        buttonContainer: {
          display: "flex",
          justifyContent: "flex-end",
        },
        otherblock: {
          height: "20vh",
          width: "750px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        codeblock: {
          height: "20vh",
          width: "750px",
          overflowY: "scroll",
          borderRadius: "5px",
          borderStyle: "solid",
          borderWidth: "thin",
          borderColor: grey[400],
        },
        select: {
          minWidth: "10vw",
        },
        textButton: {
          color: theme.palette.primary.main,
        },
        containedButton: {},
        anchorOverride: {
          textDecoration: "none",
          color: theme.palette.primary.main,
        },
        dialog: {
          padding: theme.spacing(2),
          width: "800px",
        },
        optimizationRow: {
          display: "flex",
          marginTop: theme.spacing(1),
        },
      };
    },
    { name: "ExportConfig" }
  );
}
