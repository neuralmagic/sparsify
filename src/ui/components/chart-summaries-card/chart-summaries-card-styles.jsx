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

export default function makeChartSummariesCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "relative",
          overflow: "visible",
        },
        layout: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          margin: 0,
        },
        header: {
          width: `calc(100% - ${theme.spacing(4)}px)`,
          display: "flex",
          justifyContent: "flex-start",
          marginTop: theme.spacing(4),
          marginLeft: theme.spacing(4),
          marginBottom: theme.spacing(3),
        },
        headerSelect: {
          width: "192px",
          marginRight: theme.spacing(2),
        },
        chart: {
          height: "320px",
          display: "flex",
          marginRight: theme.spacing(4),
        },
        chartYAxis: {
          width: "80px",
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
        chartYAxisNumberTop: {
          textAlign: "end",
        },
        chartYAxisNumberBottom: {
          textAlign: "end",
        },
        chartXAxis: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: theme.spacing(1),
        },
        tooltipRoot: {
          padding: theme.spacing(1),
        },
        tooltipLayout: {
          display: "flex",
          flexDirection: "column",
        },
        tooltipHeader: {
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing(1),
        },
        tooltipHeaderColor: {
          width: "16px",
          height: "16px",
          marginRight: theme.spacing(1),
          borderRadius: "16px",
        },
        tooltipValueRow: {
          display: "flex",
          marginBottom: theme.spacing(0.5),
        },
        tooltipValueRowLabel: {
          marginRight: theme.spacing(1),
        },
      };
    },
    { name: "ChartSummariesCard" }
  );
}
