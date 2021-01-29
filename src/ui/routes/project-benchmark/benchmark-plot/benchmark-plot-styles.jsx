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
import { referenceLightTheme } from "../../../app/app-theme";
import { adjustColorOpacity } from "../../../components/utils";

export default function makeBenchmarkPlotStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          height: "275px",
          paddingTop: theme.spacing(1),
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
        chart: {
          height: "250px",
          display: "flex",
        },
        chartYAxis: {
          width: "60px",
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
          paddingLeft: "60px",
        },
        chartXAxisTitle: {
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        legendRoot: {
          position: "absolute",
          padding: theme.spacing(1),
          top: 0,
          right: theme.spacing(6),
        },
        legendRow: {
          display: "flex",
          alignItems: "center",
        },
        legendColor: {
          height: "10px",
          width: "10px",
          borderRadius: "50%",
          marginRight: theme.spacing(1),
          display: "inline-block",
        },
        legendLabel: {
          color: theme.palette.text.secondary,
          display: "inline-block",
          textOverflow: "wrap",
        },
      };
    },
    { name: "BenchmarkPlot" }
  );
}
