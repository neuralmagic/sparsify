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

export default function makeAbsoluteLayoutStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
        },
        layout: {
          position: "relative",
          height: ({ spacingTop, spacingBottom }) =>
            `calc(100% - ${theme.spacing(
              spacingTop ? spacingTop : 0
            )}px - ${theme.spacing(spacingBottom ? spacingBottom : 0)}px)`,
          width: ({ spacingLeft, spacingRight }) =>
            `calc(100% - ${theme.spacing(
              spacingLeft ? spacingLeft : 0
            )}px - ${theme.spacing(spacingRight ? spacingRight : 0)}px)`,
          overflow: "hidden",
          paddingTop: ({ spacingTop }) =>
            `${theme.spacing(spacingTop ? spacingTop : 0)}px`,
          paddingBottom: ({ spacingBottom }) =>
            `${theme.spacing(spacingBottom ? spacingBottom : 0)}px`,
          paddingLeft: ({ spacingLeft }) =>
            `${theme.spacing(spacingLeft ? spacingLeft : 0)}px`,
          paddingRight: ({ spacingRight }) =>
            `${theme.spacing(spacingRight ? spacingRight : 0)}px`,
        },
      };
    },
    { name: "AbsoluteLayout" }
  );
}
