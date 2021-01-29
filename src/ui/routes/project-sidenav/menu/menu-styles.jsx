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

export default function makeProjectSideNavMenuStyles() {
  return makeStyles(
    (theme) => {
      const paddingHoriz = theme.spacing(3);
      const paddingHorizContainerLeft = theme.spacing(5);
      const paddingHorizRight = theme.spacing(1.5);
      const paddingVert = theme.spacing(2);
      const paddingVertContainerBottom = theme.spacing(3);

      return {
        root: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
        },
        item: {
          padding: 0,
          margin: 0,
        },
        link: {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          textDecoration: "none",
          paddingLeft: paddingHoriz,
          paddingRight: paddingHorizRight,
          paddingTop: paddingVert,
          paddingBottom: paddingVert,
        },
        icon: {
          marginRight: theme.spacing(2),

          "& svg": {
            fill: ({ selected }) =>
              selected ? theme.palette.primary.light : theme.palette.text.primary,
            width: "24px",
            height: "24px",
          },
        },
        arrow: {
          flex: "1 0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",

          "& svg": {
            fill: ({ selected }) =>
              selected ? theme.palette.primary.light : theme.palette.text.primary,
            width: "24px",
            height: "24px",
          },
        },
        title: {
          color: ({ selected }) =>
            selected ? theme.palette.primary.light : theme.palette.text.primary,
        },
        subContainer: {
          paddingLeft: paddingHorizContainerLeft,
          paddingRight: paddingHorizRight,
          paddingTop: paddingVert,
          paddingBottom: paddingVertContainerBottom,
          backgroundColor: theme.palette.background.paper,
        },
      };
    },
    { name: "ProjectSideNavMenu" }
  );
}
