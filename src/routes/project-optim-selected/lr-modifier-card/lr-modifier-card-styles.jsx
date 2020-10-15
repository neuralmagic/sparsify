import { makeStyles } from "@material-ui/core/styles";
import { adjustColorOpacity } from "../../../components";

export default function makeLRModifierCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "relative",
          height: "320px",
          overflow: "unset",
        },
        layout: {
          height: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          display: "flex",
          flexDirection: "row",
          padding: theme.spacing(3),
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

        modifier: {
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: theme.spacing(3),
          zIndex: 1,
        },
        modifierLabelContainer: {
          position: "absolute",
          left: 0,
          height: "100%",
        },
        modifierLabelWrapper: {
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "center",
        },
        modifierLabel: {
          position: "absolute",
          right: theme.spacing(3),
        },
        modifierBackground: {
          width: "100%",
          height: theme.spacing(0.5),
          backgroundColor: theme.palette.divider,
        },
        modifierActive: {
          height: "100%",
          backgroundColor: theme.palette.primary.main,
        },

        background: {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
        },
        backgroundDivider: {
          width: "2px",
          height: "100%",
          backgroundColor: theme.palette.text.disabled,
          position: "relative",
          display: "flex",
          justifyContent: "center",
        },
        backgroundDividerLabel: {
          position: "absolute",
          bottom: -1 * theme.spacing(2),
          fontSize: "0.5rem",
        },
        backgroundSection: {
          position: "relative",
          display: "flex",
          justifyContent: "center",
        },
        backgroundSectionLabelContainer: {
          position: "absolute",
          bottom: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        backgroundSectionLabel: {
          fontSize: "0.7rem",
        },
        backgroundSectionLabelTick: {
          width: "1px",
          height: theme.spacing(1),
          backgroundColor: theme.palette.divider,
        },
        backgroundSectionFill: {
          flex: "1 0",
        },
        backgroundColorOne: {
          backgroundColor: adjustColorOpacity(theme.palette.primary.main, 0.05),
        },
        backgroundColorTwo: {
          backgroundColor: adjustColorOpacity(theme.palette.primary.main, 0.1),
        },
        backgroundColorThree: {
          backgroundColor: adjustColorOpacity(theme.palette.primary.main, 0.2),
        },
      };
    },
    { name: "PruningModifier" }
  );
}
