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

export default function makeChartPruningStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          height: `calc(100% - ${theme.spacing(3)}px)`,
          marginBottom: theme.spacing(3),
          display: "flex",
          flexDirection: "column",
          padding: 0,
          margin: 0,
        },
        chart: {
          height: "100%",
          display: "flex",
        },
        chartAxisTitle: {
          fontSize: "0.7rem",
        },
        chartYAxis: {
          width: theme.spacing(2),
          display: "flex",
          flexDirection: "column",
        },
        chartYAxisTitle: {
          flex: "1 0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        chartYAxisTitleRotation: {
          transform: "rotate(-90deg)",
        },
        chartYAxisNumber: {
          textAlign: "end",
          fontSize: "0.7rem",
        },
        chartXAxis: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: theme.spacing(1),
          marginLeft: theme.spacing(2),
        },
      };
    },
    { name: "ChartPruning" }
  );
}
