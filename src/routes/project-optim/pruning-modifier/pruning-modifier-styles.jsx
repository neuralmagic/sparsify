import { makeStyles } from "@material-ui/core/styles"

export default function makePruningModifierStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          paddingTop: 20,
          paddingLeft: 20
        },
        sparsityInput: {
          width: 80
        }
      };
    },
    { name: "PruningModifier" }
  );
}
