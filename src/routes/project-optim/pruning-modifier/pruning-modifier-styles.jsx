import { makeStyles } from "@material-ui/core/styles";

export default function makePruningModifierStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          paddingRight: 20
        },
        sparsityInput: {
          width: 80,
          marginRight: 20,
          marginBottom: 40
        },
      };
    },
    { name: "PruningModifier" }
  );
}
