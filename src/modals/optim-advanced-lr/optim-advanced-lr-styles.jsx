import { makeStyles } from "@material-ui/core/styles";
import { adjustColorOpacity } from "../../components";

export default function makeOptimAdvancedLRStyles() {
  return makeStyles(
    (theme) => {
      return {
        closeButton: {
          position: "absolute",
          right: theme.spacing(1),
          top: theme.spacing(1),
        },
        content: {
          width: "80vw",
          height: "80vh",
          maxWidth: "1024px",
          display: "flex",
          flexDirection: "column",
          overflow: "unset",
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4),
        },
        chartMetrics: {
          height: "33%",
          width: "100%",
          display: "flex",
          marginTop: theme.spacing(2),
        },
        metrics: {
          width: `calc(192px - ${theme.spacing(4)}px)`,
          height: "100%",
          paddingRight: theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          position: "relative",
        },
        metricsDiv: {
          position: "absolute",
          width: "1px",
          height: "100%",
          backgroundColor: theme.palette.divider,
          right: theme.spacing(2),
        },
        metric: {
          marginBottom: theme.spacing(2),
        },
        chart: {
          flex: "1 0",
          height: "100%",
        },
        cardActions: {
          width: `calc(256px - ${theme.spacing(6)}px)`,
          height: "100%",
          paddingLeft: theme.spacing(6),
          display: "flex",
          flexDirection: "column",
        },
        actionButtons: {
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: theme.spacing(3),
        },
        actionButton: {
          marginLeft: theme.spacing(1),
        },
        epochLabel: {
          marginBottom: theme.spacing(2),
        },
        epochRange: {
          display: "flex",
          alignItems: "center",
        },
        epochDash: {
          width: theme.spacing(3),
          height: "2px",
          backgroundColor: theme.palette.divider,
        },
        epochInput: {
          width: theme.spacing(8),

          "& input": {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
          },
        },
        modifiers: {
          flex: "1 0",
          width: "100%",
          marginTop: theme.spacing(5),
          display: "flex",
          flexDirection: "column",
        },
        modifiersHeader: {
          minHeight: "48px",
          padding: theme.spacing(1),
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          backgroundColor: adjustColorOpacity(theme.palette.primary.light, 0.1),
          display: "flex",
          alignItems: "center",
          borderRadius: "4px",
          overflow: "hidden",
        },
        scrollerRoot: {
          position: "relative",
          width: "100%",
          flex: "1 0",
        },
        modifiersList: {
          padding: 0,
        },

        lrRowItem: {
          width: "192px",
          display: "flex",
          alignItems: "flex-end",
        },

        lrModRow: {
          display: "flex",
          alignItems: "flex-end",
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),

          "& input": {
            paddingTop: theme.spacing(0.75),
            paddingBottom: theme.spacing(0.75),
          },
        },
        lrModType: {
          marginLeft: theme.spacing(3),
        },
        lrModTypeSelector: {
          width: `calc(100% - ${theme.spacing(6)}px)`,
        },
        lrModEpoch: {
          width: "56px",
          marginRight: theme.spacing(3),
        },
        lrModOptions: {
          flex: "1 0",
        },
        lrModOption: {
          width: "80px",
          marginRight: theme.spacing(3),
        },
        lrModButtons: {
          marginRight: theme.spacing(3),
          alignSelf: "center",
        },
      };
    },
    { name: "OptimAdvancedLR" }
  );
}
