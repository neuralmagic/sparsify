import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectHeaderStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
        },

        progressLineContainer: {
          flex: "0 1",
          position: "relative",
          marginLeft: "24px",
        },
        backgroundLine: {
          width: "4px",
          height: "50px",
          backgroundColor: theme.palette.divider,
        },
        progressLine: {
          height: "4px",
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: theme.palette.primary.main,
          transitionProperty: "width",
          transitionDuration: "0.2s",
        },

        iconContainer: {
          border: "solid",
          borderWidth: "2px",
          borderRadius: "100%",
          borderColor: ({ active }) =>
            active ? theme.palette.primary.main : theme.palette.divider,
          transitionProperty: "borderColor",
          transitionDuration: "0.2s",
          height: "48px",
          width: "48px",
          marginRight: theme.spacing(2),
        },
        iconWrapper: {
          width: "48px",
          height: "48px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          "& svg": {
            width: "32px",
            height: "32px",
            fill: ({ active }) =>
              active ? theme.palette.primary.main : theme.palette.divider,
            transitionProperty: "fill",
            transitionDuration: "0.2s",
          },
        },
        iconText: {
          transitionProperty: "color",
          transitionDuration: "0.2s",
        },
        iconGroup: {
          width: "100%",
          display: "flex",
          alignItems: "center",
        },
      };
    },
    { name: "ProgressHeader" }
  );
}
