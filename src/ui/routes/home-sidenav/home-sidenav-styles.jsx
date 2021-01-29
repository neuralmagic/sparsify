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

export default function makeHomeSideNavStyles() {
  return makeStyles(
    (theme) => {
      const paddingSides = theme.spacing(1);
      const paddingTopBot = theme.spacing(3);

      return {
        listRoot: {
          width: "100%",
        },
        projectCard: {
          width: `calc(100% - 2 * ${paddingSides}px)`,
          paddingLeft: `${paddingSides}px`,
          paddingRight: `${paddingSides}px`,
          textDecoration: "none",
        },
        projectCardTitle: {
          width: "100%",
          "& textarea": {
            color: theme.palette.text.primary,
            cursor: "pointer",
            overflow: "hidden",
          },
          "& .Mui-disabled": {
            cursor: "pointer",
            paddingBottom: 0,
            lineHeight: "1.25em",
            "&::before": {
              borderBottom: "none",
            },
          },
        },
        noProjectTitle: {
          marginLeft: theme.spacing(1),
        },
        projectCardSubTitle: {
          width: "100%",
        },
        layout: {
          position: "relative",
          height: `calc(100% - 2 * ${paddingTopBot})`,
          width: `calc(100% - 2 * ${paddingSides})`,
          overflow: "scroll",
          paddingTop: `${paddingTopBot}px`,
          paddingBottom: `${paddingTopBot}px`,
          paddingLeft: `${paddingSides}px`,
          paddingRight: `${paddingSides}px`,
        },
      };
    },
    { name: "HomeSideNav" }
  );
}
