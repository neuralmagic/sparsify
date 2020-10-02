import { makeStyles } from "@material-ui/core/styles";

export default function makePruningModifierStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          paddingRight: theme.spacing(4),
          paddingTop: theme.spacing(4),
          paddingLeft: theme.spacing(4),
          position: 'relative'
        },
        sparsitySliderRoot: {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2)
        },
        sparsityInput: {
          width: 80,
          marginRight: 20,
        },
        editButton: {
          position: 'absolute',
          right: 0,
          top: 0
        }
      };
    },
    { name: "PruningModifier" }
  );
}
