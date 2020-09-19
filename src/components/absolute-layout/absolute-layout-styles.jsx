import { makeStyles } from "@material-ui/core/styles";

export default function makeAbsoluteLayoutStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
        },
        layout: {
          position: "relative",
          height: ({ spacingTop, spacingBottom }) =>
            `calc(100% - ${theme.spacing(
              spacingTop ? spacingTop : 0
            )}px - ${theme.spacing(spacingBottom ? spacingBottom : 0)}px)`,
          width: ({ spacingLeft, spacingRight }) =>
            `calc(100% - ${theme.spacing(
              spacingLeft ? spacingLeft : 0
            )}px - ${theme.spacing(spacingRight ? spacingRight : 0)}px)`,
          overflow: "hidden",
          paddingTop: ({ spacingTop }) =>
            `${theme.spacing(spacingTop ? spacingTop : 0)}px`,
          paddingBottom: ({ spacingBottom }) =>
            `${theme.spacing(spacingBottom ? spacingBottom : 0)}px`,
          paddingLeft: ({ spacingLeft }) =>
            `${theme.spacing(spacingLeft ? spacingLeft : 0)}px`,
          paddingRight: ({ spacingRight }) =>
            `${theme.spacing(spacingRight ? spacingRight : 0)}px`,
        },
      };
    },
    { name: "AbsoluteLayout" }
  );
}
