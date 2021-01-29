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

export default function makeDisplayCardMetricsStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          width: `calc(192px - ${theme.spacing(4)}px)`,
          height: "100%",
          paddingRight: theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          position: "relative",
        },
        swipeContainer: {
          width: "100%",
          flex: "1 0",
        },
        swipable: {
          width: "100%",
          height: "100%",
        },
        swipableSlide: {
          width: "100%",
          height: "100%",
        },
        groupLayout: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
        metric: {
          marginBottom: theme.spacing(2),
        },

        swipeActions: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        swipeActionBody: {
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
        swipeActionTitle: {},
        pagination: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: theme.spacing(0.5),
        },
        pageMarker: {
          width: theme.spacing(0.5),
          height: theme.spacing(0.5),
          marginLeft: theme.spacing(0.25),
          marginRight: theme.spacing(0.25),
          backgroundColor: theme.palette.divider,
          borderRadius: "100%",
          overflow: "hidden",
        },
        pageMarkerSelected: {
          backgroundColor: theme.palette.primary.main,
        },

        divider: {
          position: "absolute",
          width: "1px",
          height: "100%",
          backgroundColor: theme.palette.divider,
          right: theme.spacing(2),
        },
      };
    },
    { name: "DisplayCardMetrics" }
  );
}
