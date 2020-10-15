import { makeStyles } from "@material-ui/core/styles";

export default function makeOptimAdvancedPruningStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          '& .MuiTextField-root': {
            width: 60,
          }
        },
        title: {
          fontSize: 12,
          marginBottom: 15
        },
        slider: {
          width: 200
        },
        recoveryContainer: {
          marginTop: 30
        }
      }
    },
    { name: "PruningSettings" }
  );
}