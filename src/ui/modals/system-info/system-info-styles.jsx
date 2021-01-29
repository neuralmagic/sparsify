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

export default function createSystemInfoStyles(theme) {
  return makeStyles(
    (theme) => {
      return {
        dialog: {
          padding: theme.spacing(2),
        },
        title: {
          paddingLeft: theme.spacing(2),
          fontSize: "72px",
          fontFamily: theme.typography.fontFamily,
        },
        logo: {
          height: "80px",
          width: "80px",
          "& .colorOne": {
            color: theme.palette.text.primary,
            fill: theme.palette.text.primary,
          },
        },
        trademark: {
          fontSize: "15px",
          color: theme.palette.text.primary,
          alignSelf: "start",
          paddingTop: theme.spacing(0.5),
          paddingLeft: theme.spacing(0.5),
        },
        block: {
          margin: theme.spacing(2, 0),
        },
        link: {
          color: theme.palette.text.primary,
          cursor: "pointer",
          textDecoration: "underline",
        },
      };
    },
    { name: "SystemInfo" }
  );
}
