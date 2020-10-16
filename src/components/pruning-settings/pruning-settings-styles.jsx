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
          fontSize: 14,
          marginBottom: theme.spacing(2)
        },
        balanceTitle: {
          fontSize: 14,
        },
        slider: {
          width: 200,
          marginLeft: 30
        },
        sliderMarkLabel: {
          top: -10,
          fontSize: 10
        },
        sliderMarkLabelActive: {
          color: 'rgba(0, 0, 0, 0.54)'
        },
        recoveryContainer: {
          marginTop: 30
        }
      }
    },
    { name: "PruningSettings" }
  );
}