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
      }
    };
  },
  { name: "OptimAdvancedPruningTableStyles" }
)

export const makeTableRowStyles = () => makeStyles(
  (theme) => {
    return {
      root: {
        '& .MuiTypography-root': {
          fontSize: 14
        },
        '& > *': {
          borderBottom: 'unset',
        },
        height: 40
      },
      disabled: {
        opacity: 0.4
      },
      sparsityCell: {
        display: 'flex',
        alignItems: 'center',
        minWidth: 170
      },
      sparsityValue: {
        marginLeft: 10
      },
      layerIndexText: {
        display: 'inline-flex',
        fontSize: '9px!important',
        color: '#2B2B2B'
      },
      layerDetails: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2)
      },
      layerDetailsSection: {
        paddingRight: theme.spacing(8)
      },
      layerDetailsSectionHeader: {
        borderBottom: '1px solid #E0E0E0',
        marginBottom: 10
      },
      layerDetailsSectionText: {
        color: theme.palette.disabled.main
      },
      chart: {
        width: 200,
        height: 120
      }
    };
  },
  { name: "OptimAdvancedPruningTableRowStyles" }
)

export const makeFiltersStyles = () => makeStyles(
  (theme) => {
    return {
      input: {
        width: 100
      }
    }
  },
  { name: "OptimAdvancedPruningFiltersStyles" }
)
