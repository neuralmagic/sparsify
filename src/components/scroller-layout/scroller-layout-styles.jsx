import { makeStyles } from "@material-ui/core/styles";

export default function makeScrollerLayoutStyles(spacingHoriz, spacingVert) {
  return makeStyles(
    (theme) => {
      const paddingSides = theme.spacing(spacingHoriz);
      const paddingTopBot = theme.spacing(spacingVert);

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
          height: `calc(100% - 2 * ${paddingTopBot}px)`,
          width: `calc(100% - 2 * ${paddingSides}px)`,
          overflow: "scroll",
          paddingTop: `${paddingTopBot}px`,
          paddingBottom: `${paddingTopBot}px`,
          paddingLeft: `${paddingSides}px`,
          paddingRight: `${paddingSides}px`,

          "& div": {
            height: "fit-content",
          },
        },
      };
    },
    { name: "ScrollerLayout" }
  );
}
