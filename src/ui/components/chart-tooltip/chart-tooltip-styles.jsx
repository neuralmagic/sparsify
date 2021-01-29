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

export default function makeChartTooltipStyles() {
  return makeStyles(
    (theme) => {
      return {
        positioning: {
          width: 0,
          height: 0,
          position: "relative",
        },
        root: {
          position: "absolute",
          top: theme.spacing(3),
          left: -1 * theme.spacing(16),
          width: theme.spacing(32),
          padding: theme.spacing(1),
        },
        layout: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing(1),
        },
        headerColor: {
          width: "16px",
          height: "16px",
          marginRight: theme.spacing(1),
          borderRadius: "16px",
        },
        metrics: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
        },
        metric: {
          display: "flex",
          marginBottom: theme.spacing(0.5),
          alignItems: "center",
          width: "100%",
        },
        metricLabel: {
          marginRight: theme.spacing(1),
          display: "block",
          float: "left",
          flexShrink: "0",
        },
        metricValue: {
          flex: "1 0",
          width: 0,
          wordWrap: "break-word",
        },
      };
    },
    { name: "ChartTooltip" }
  );
}
