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
        sparsitySliderRoot: {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
        },
        sparsityInput: {
          width: 80,
          marginRight: 20,
        },
        editButton: {
          position: "absolute",
          right: 45,
          top: theme.spacing(1),
        },
        menuButton: {
          position: "absolute",
          right: 10,
          top: theme.spacing(1),
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
      };
    },
    { name: "PruningModifier" }
  );
}
