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

export default function makeSelectModelStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "relative",
          width: "100%",
          height: "100%",
        },
        content: {
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        },
        selectFileContainer: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          height: "56px",
          marginTop: theme.spacing(3),
        },
        selectFileOr: {
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          zIndex: 1,
        },
        selectFileUpload: {
          left: 1,
          paddingTop: "15px", // match input in material ui
          paddingBottom: "15px", // match input in material ui
          border: "solid",
          borderRadius: "4px",
          borderColor: theme.palette.action.disabled,
          borderWidth: "1px",
        },
        selectFileUploadTextSelected: {
          marginLeft: theme.spacing(2),
          marginRight: 45,
        },
        selectFileUploadText: {
          marginLeft: theme.spacing(2),
          // marginRight: 45,
        },
        selectFileRemote: {
          right: 1,
        },
        selectFileClear: {
          position: "absolute",
          right: 5,
          opacity: 1,
          zIndex: 3,
        },
        selectFileBase: {
          position: "absolute",
          top: 0,
          width: "46%",
          paddingRight: 0,
          opacity: 1,
          zIndex: 1,
          transitionProperty: "width, opacity",
          transitionDuration: "0.2s",
        },
        selectFileUnselected: {
          opacity: 0,
        },
        selectFileSelected: {
          width: "99%",
          zIndex: 2,
          "& input": {
            paddingRight: 55,
          },
        },
        loaderContainer: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
        loaderText: {
          marginTop: theme.spacing(3),
        },
      };
    },
    { name: "SelectModel" }
  );
}
