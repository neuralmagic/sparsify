import { makeStyles } from "@material-ui/core/styles";

export default function makeAbsoluteLayoutStyles(
  spacingLeft,
  spacingRight,
  spacingTop,
  spacingBottom
) {
  return makeStyles(
    (theme) => {
      const paddingLeft = theme.spacing(spacingLeft ? spacingLeft : 0);
      const paddingRight = theme.spacing(spacingRight ? spacingRight : 0);
      const paddingTop = theme.spacing(spacingTop ? spacingTop : 0);
      const paddingBottom = theme.spacing(spacingBottom ? spacingBottom : 0);

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
          height: `calc(100% - ${paddingTop}px - ${paddingBottom}px)`,
          width: `calc(100% - ${paddingLeft}px - ${paddingRight}px)`,
          overflow: "hidden",
          paddingTop: `${paddingTop}px`,
          paddingBottom: `${paddingBottom}px`,
          paddingLeft: `${paddingLeft}px`,
          paddingRight: `${paddingRight}px`,
        },
      };
    },
    { name: "AbsoluteLayout" }
  );
}
