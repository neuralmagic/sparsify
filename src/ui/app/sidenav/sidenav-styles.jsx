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

export default function makeAppSideNavStyles() {
  return makeStyles(
    (theme) => ({
      root: {
        height: "100%",
        width: "288px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        borderRadius: 0,
        position: "relative",
      },
      header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: theme.spacing(3),
      },
      logo: {
        width: "40px",
        height: "40px",
        "& .colorOne": {
          color: theme.palette.text.primary,
          fill: theme.palette.text.primary,
        },
      },
      info: {
        top: theme.spacing(1),
        right: theme.spacing(1),
        position: "absolute",
        margin: theme.spacing(0.5),
      },
      infoButton: {
        padding: 0,
        margin: 0,
        "& svg": {
          fill: theme.palette.text.secondary,
          width: "22px",
          height: "22px",
        },
      },
      title: {
        paddingLeft: theme.spacing(2),
        fontSize: "32px",
        color: theme.palette.text.primary,
      },
      trademark: {
        fontSize: "10px",
        color: theme.palette.text.secondary,
        alignSelf: "start",
        paddingTop: theme.spacing(0.5),
        paddingLeft: theme.spacing(0.5),
      },
      body: {
        flex: "1 0",
        width: "100%",
        position: "relative",
      },
    }),
    { name: "AppSideNav" }
  );
}
