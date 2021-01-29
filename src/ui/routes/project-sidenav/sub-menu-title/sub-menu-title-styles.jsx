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

export default function makeProjectSideNavSubMenuStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: theme.spacing(0.5),
        },
        addButton: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "32px",
          height: "32px",
          minWidth: "32px",
          padding: 0,
          margin: 0,

          "& svg": {
            fill: theme.palette.text.secondary,
            width: "20px",
            height: "20px",
          },
        },
      };
    },
    { name: "ProjectSideNavSubMenuTitle" }
  );
}
