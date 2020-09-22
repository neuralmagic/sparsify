import { makeStyles } from "@material-ui/core/styles"

export default function makeOptimPruningStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          paddingTop: 20,
          paddingLeft: 20
        },
      };
    },
    { name: "OptimPruning" }
  );
}
