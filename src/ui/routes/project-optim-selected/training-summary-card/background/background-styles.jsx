import { makeStyles } from "@material-ui/core/styles";
import { adjustColorOpacity } from "../../../../components";

export default function makeTrainingSummaryCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        background: {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
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
