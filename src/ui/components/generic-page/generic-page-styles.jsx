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

export default function makeGenericPageStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        layout: {
          width: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "10%",
          paddingLeft: "10%",
          paddingRight: "10%",
        },
        icon: {
          fill: theme.palette.text.secondary,
          marginBottom: theme.spacing(6),
          width: "200px",
          height: "200px",
        },
        name: {
          display: "-webkit-box",
          lineClamp: 2,
          boxOrient: "vertical",
          overflow: "hidden",
        },
        desc: {
          marginTop: theme.spacing(2),
          display: "-webkit-box",
          lineClamp: 3,
          boxOrient: "vertical",
          overflow: "hidden",
        },
      };
    },
    { name: "GenericPage" }
  );
}
