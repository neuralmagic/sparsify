import { makeStyles } from "@material-ui/core/styles";

export default function makeLRModRowStyles() {
  return makeStyles(
    (theme) => {
      return {
        lrRowItem: {
          width: "192px",
          display: "flex",
          alignItems: "flex-end",
        },

        lrModRow: {
          display: "flex",
          alignItems: "flex-end",
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),

          "& input": {
            paddingTop: theme.spacing(0.75),
            paddingBottom: theme.spacing(0.75),
          },
        },
        lrModType: {
          marginLeft: theme.spacing(3),
        },
        lrModTypeSelector: {
          width: `calc(100% - ${theme.spacing(6)}px)`,
        },
        lrModEpoch: {
          width: "56px",
          marginRight: theme.spacing(3),
        },
        lrModOptions: {
          flex: "1 0",
        },
        lrModOption: {
          width: "80px",
          marginRight: theme.spacing(3),
        },
        lrModButtons: {
          marginRight: theme.spacing(3),
          alignSelf: "center",
        },
      };
    },
    { name: "LRModRow" }
  );
}
