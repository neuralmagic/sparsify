import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectHeaderStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        },

        progressLineContainer: {
          flex: "1 0",
          position: "relative",
        },
        backgroundLine: {
          width: "100%",
          height: "4px",
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          border: "solid",
          borderWidth: "2px",
          borderRadius: "100%",
          borderColor: ({ active }) =>
            active ? theme.palette.primary.main : theme.palette.divider,
          transitionProperty: "borderColor",
          transitionDuration: "0.2s",
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
          position: "absolute",
          bottom: -1 * theme.spacing(4),
          color: ({ active }) =>
            active ? theme.palette.primary.main : theme.palette.text.disabled,
          transitionProperty: "color",
          transitionDuration: "0.2s",
        },
      };
    },
    { name: "ProgressHeader" }
  );
}
