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

export default function makeOptimAdvancedPruningStyles() {
  return makeStyles(
    (theme) => {
      return {
        closeButton: {
          position: "absolute",
          right: theme.spacing(1),
          top: theme.spacing(1),
        },
        content: {
          width: "85vw",
          height: "85vh",
          maxWidth: "1280px",
          overflow: "unset",
          padding: 0,
          margin: 0,
        },
        layout: {
          height: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          width: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          padding: theme.spacing(3),
        },
        summary: {
          width: "100%",
          height: `280px`,
          display: "flex",
        },
        layers: {
          width: "100%",
          height: `calc(100% - 280px - ${theme.spacing(5)}px)`,
          marginTop: theme.spacing(5),
          display: "flex",
          flexDirection: "column",
        },
        update: {
          width: theme.spacing(11),
          marginTop: theme.spacing(2),
        },

        dialogTitle: {
          marginLeft: theme.spacing(5),
        },
        dialogBox: {
          display: "flex",
          alignItems: "flex-end",
          flexDirection: "column",
        },
        divider: {
          marginLeft: theme.spacing(6),
          marginRight: theme.spacing(6),
        },
        layersChartContainer: {
          flexGrow: 1,
          marginTop: 20,
          marginBottom: 20,
        },
        metricsContainer: {
          marginBottom: theme.spacing(6),
        },
        layersChart: {
          width: "100%",
        },
        secondPlotSelect: {
          minWidth: 120,
        },
      };
    },
    { name: "OptimAdvancedPruning" }
  );
}

export const makeTableStyles = () =>
  makeStyles(
    (theme) => {
      return {
        header: {
          "& .MuiTypography-root": {
            fontSize: 10,
            textTransform: "uppercase",
          },
          backgroundColor: "#f4f4f8",
        },
        searchInput: {
          background: "white",
          marginLeft: theme.spacing(1),
          "& .MuiInputBase-root": {
            paddingLeft: 5,
            fontSize: 14,
          },
        },
        searchInputAdornment: {
          color: theme.palette.disabled.main,
        },
      };
    },
    { name: "OptimAdvancedPruningTableStyles" }
  );

export const makeTableRowStyles = () =>
  makeStyles(
    (theme) => {
      return {
        root: {
          "& .MuiTypography-root": {
            fontSize: 14,
          },
          "& > *": {
            borderBottom: "unset",
          },
          height: 40,
        },
        disabled: {
          opacity: 0.4,
        },
        layerNameTableCell: {
          alignContent: "center",
          whiteSpace: "nowrap",
          "& .MuiTypography-root": {
            display: "inline",
          },
        },
        sparsityCell: {
          display: "flex",
          alignItems: "center",
          minWidth: 170,
        },
        sparsityValue: {
          marginLeft: 10,
        },
        layerIndexText: {
          display: "inline-flex",
          fontSize: "9px!important",
          color: "#2B2B2B",
        },
        layerDetails: {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(2),
          paddingLeft: theme.spacing(5),
        },
        layerDetailsSection: {
          paddingRight: theme.spacing(8),
        },
        layerDetailsSectionHeader: {
          borderBottom: "1px solid #E0E0E0",
          marginBottom: 10,
        },
        layerDetailsSectionText: {
          color: theme.palette.disabled.main,
        },
        chart: {
          width: 200,
          height: 120,
        },
        sensitivityLabel: {
          "&.top": {
            color: theme.palette.primary.light,
          },
          "&.low": {
            color: theme.palette.warning.light,
          },
        },
      };
    },
    { name: "OptimAdvancedPruningTableRowStyles" }
  );

export const makeFiltersStyles = () =>
  makeStyles(
    (theme) => {
      return {
        input: {
          width: 100,
        },
      };
    },
    { name: "OptimAdvancedPruningFiltersStyles" }
  );
