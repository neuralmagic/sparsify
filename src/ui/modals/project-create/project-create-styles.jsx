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

export default function makeProjectCreateStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          height: "80vh",
          maxHeight: "512px",
          display: "flex",
          flexDirection: "column",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          marginTop: theme.spacing(6),
          flex: "1 0",
        },
        swipable: {
          flex: "1 0",
        },
        swipableSlide: {
          width: "100%",
          height: "100%",
        },
        cancelButton: {
          color: theme.palette.text.secondary,
        },
        previousButton: {
          color: theme.palette.text.secondary,
          opacity: 1,
          transitionProperty: "opacity",
          transitionDuration: "0.2s",
        },
        previousButtonHidden: {
          opacity: 0,
        },
      };
    },
    { name: "ProjectCreateDialog" }
  );
}
