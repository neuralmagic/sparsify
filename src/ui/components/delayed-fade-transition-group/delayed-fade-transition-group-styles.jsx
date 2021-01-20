import { makeStyles } from "@material-ui/core/styles";

export default function makeFadeTransitionStyles() {
  return makeStyles(
    (theme) => {
      return {
        hiddenChild: {
          display: "none",
        },
      };
    },
    { name: "DelayedFadeTransitionGroup" }
  );
}
