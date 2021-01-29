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

export default function makeBenchmarkStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
        },
        fab: {
          position: "fixed",
          right: theme.spacing(4),
          bottom: theme.spacing(4),
          padding: theme.spacing(3),
        },
        body: {
          position: "relative",
          height: "fit-content",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        transitionGroup: {
          width: "100%",
        },
        layout: {
          height: "fit-content",
          width: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          maxWidth: "1024px",
          display: "flex",
          flexDirection: "column",
          margin: theme.spacing(3),
        },
        loader: {
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: theme.spacing(8),
        },
      };
    },
    { name: "Benchmark" }
  );
}
