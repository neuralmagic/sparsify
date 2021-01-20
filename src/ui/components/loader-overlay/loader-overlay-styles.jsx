import { makeStyles } from "@material-ui/core/styles";

export default function makeLoaderOverlayStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backgroundColor: theme.palette.overlay,
          color: theme.palette.primary.light,
          zIndex: 1200,
        },
        loader: {
          width: "100%",
          height: "100%",
        },
        error: {
          width: "80%!important",
          height: "100%",
          paddingLeft: "10%",
          paddingRight: "10%",
        },
        transitionEnter: {
          opacity: 0,
        },
        transitionEnterActive: {
          opacity: 1,
          transition: ({ transTime }) => `opacity ${transTime}ms`,
        },
        transitionExit: {
          opacity: 1,
        },
        transitionExitActive: {
          opacity: 0,
          transition: ({ transTime }) => `opacity ${transTime}ms`,
        },
      };
    },
    { name: "LoaderOverlay" }
  );
}
