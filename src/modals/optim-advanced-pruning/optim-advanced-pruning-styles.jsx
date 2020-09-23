import { makeStyles } from "@material-ui/core/styles";

export default function makeOptimAdvancedPruningStyles() {
  return makeStyles(
    (theme) => {
      return {
        paper: {
          position: 'absolute',
          top: 20,
          maxWidth: 1200,
          paddingTop: 30,
          paddingLeft: 60,
          paddingRight: 60,
          marginBottom: 20
        },
        title: {
          marginBottom: 50
        },
        closeButton: {
          position: 'absolute',
          top: 15,
          right: 15
        },
        layersChartContainer: {
          flexGrow: 1,
          marginTop: 20,
          marginBottom: 20
        },
      };
    },
    { name: "OptimAdvancedPruning" }
  );
}

export const makeTableStyles = () => makeStyles(
  (theme) => {
    return {
      header: {
        '& .MuiTypography-root': {
          fontSize: 10,
          textTransform: 'uppercase'
        },
        backgroundColor: '#f4f4f8'
      },
      row: {
        '& .MuiTypography-root': {
          fontSize: 14
        },
        height: 40
      },
      rowDisabled: {
        opacity: 0.4
      },
      sparsityCell: {
        display: 'flex',
        alignItems: 'center',
        minWidth: 170
      },
      sparsityValue: {
        marginLeft: 10
      }
    };
  },
  { name: "OptimAdvancedPruningTableStyles" }
)
