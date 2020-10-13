import { makeStyles } from "@material-ui/core/styles";

export default function makePruningModifierStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          paddingRight: theme.spacing(4),
          paddingTop: theme.spacing(4),
          paddingLeft: theme.spacing(4),
          position: "relative",
        },
        metricsRoot: {
          width: 85
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
        divider: {
          marginLeft: theme.spacing(3),
          marginRight: theme.spacing(3),
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
        }
      };
    },
    { name: "PruningModifier" }
  );
}
