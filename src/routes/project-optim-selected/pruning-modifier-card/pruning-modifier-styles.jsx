import { makeStyles } from "@material-ui/core/styles";

export default function makePruningModifierStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "relative",
          height: "340px",
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

        sparsitySliderRoot: {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
          '& .MuiSlider-root': {
            width: 130
          }
        },
        sparsityInput: {
          width: 80,
          marginRight: 20,
        },
        editButton: {
          position: "absolute",
          right: theme.spacing(8),
          top: theme.spacing(2),
        },
        menuButton: {
          position: "absolute",
          right: theme.spacing(3),
          top: theme.spacing(2),
        },
        popoverMenu: {
          padding: 25,
        },
        popoverInput: {
          width: 100,
        },
        popoverSlider: {
          width: 150,
        },
        pruningTypeSelect: {
          display: "flex",
          flex: 1,
        },
        presetFiltersTitle: {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
        },
        filtersRoot: {
          minWidth: 240,
          marginTop: theme.spacing(3)
        },
        perfSlider: {
          width: 230,
          marginLeft: 30
        },
        perfSliderMarkLabel: {
          top: -10,
          fontSize: 10
        },
        perfSliderMarkLabelActive: {
          color: 'rgba(0, 0, 0, 0.54)'
        }
      };
    },
    { name: "PruningModifier" }
  );
}
