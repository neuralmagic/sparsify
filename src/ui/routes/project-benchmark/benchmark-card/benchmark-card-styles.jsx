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
import { referenceDarkTheme } from "../../../app/app-theme";

export default function makeBenchmarkCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          height: "350px",
          overflow: "visible",
          position: "relative",
        },
        layout: {
          height: "fit-content",
          width: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          maxWidth: "1024px",
          display: "flex",
          flexDirection: "column",
          margin: theme.spacing(3),
        },
        loaderContent: {
          alignItems: "center",
          flexDirection: "column",
          display: "flex",
          color: referenceDarkTheme.palette.text.primary,
        },
        cancelButton: {
          color: referenceDarkTheme.palette.text.secondary,
        },
        title: {
          marginBottom: theme.spacing(2),
          display: "flex",
          alignItems: "baseline",
        },
        headerName: {
          marginRight: theme.spacing(1),
          width: "fit-content",
        },
        headerNameGroup: {
          width: "fit-content",
        },
        optimLink: {
          textDecoration: "none",
          color: theme.palette.text.primary,
          "&:hover": {
            textDecoration: "underline",
          },
        },
        headerDate: {
          flexGrow: 1,
        },
        headerLabel: {
          marginRight: theme.spacing(1),
        },
        headerGroup: {
          marginRight: theme.spacing(2),
          display: "flex",
          alignItems: "center",
        },
        loaderContainer: {
          width: "100%",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        cardContainer: {
          height: "350px",
        },
        loaderText: {
          marginTop: theme.spacing(3),
        },
        transitionGroup: {
          height: "350px",
        },
      };
    },
    { name: "BenchmarkCard" }
  );
}
