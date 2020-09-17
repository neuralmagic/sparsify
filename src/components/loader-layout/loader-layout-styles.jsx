import { makeStyles } from "@material-ui/core/styles";

export default function makeLoaderLayoutStyles(
  loaderSpacingHoriz,
  loaderSpacingVert,
  errorSpacingHoriz,
  errorSpacingVert
) {
  return makeStyles(
    (theme) => {
      const loaderPaddingHoriz = theme.spacing(
        loaderSpacingHoriz ? loaderSpacingHoriz : 0
      );
      const loaderPaddingVert = theme.spacing(
        loaderSpacingVert ? loaderSpacingVert : 0
      );
      const errorPaddingHoriz = theme.spacing(
        errorSpacingHoriz ? errorSpacingHoriz : 0
      );
      const errorPaddingVert = theme.spacing(
        errorSpacingVert ? errorSpacingVert : 0
      );

      return {
        root: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        error: {
          color: theme.palette.error.main,
          paddingTop: `${errorPaddingVert}px`,
          paddingBottom: `${errorPaddingVert}px`,
          paddingLeft: `${errorPaddingHoriz}px`,
          paddingRight: `${errorPaddingHoriz}px`,
        },
        progress: {
          paddingTop: `${loaderPaddingVert}px`,
          paddingBottom: `${loaderPaddingVert}px`,
          paddingLeft: `${loaderPaddingHoriz}px`,
          paddingRight: `${loaderPaddingHoriz}px`,
        },
      };
    },
    { name: "LoaderLayout" }
  );
}
