import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectPerfStyles() {
  return makeStyles(
    (theme) => {
      const paddingButton = theme.spacing(3);
      const positionButton = theme.spacing(4);

      return {
        root: {
          display: "flex",
        },
        body: {
          position: "relative",
          height: "fit-content",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        },
        layout: {
          height: "fit-content",
          width: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          maxWidth: "1024px",
          display: "flex",
          flexDirection: "column",
          margin: theme.spacing(3),
        },
        loader: {
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: theme.spacing(8),
        },
        title: {
          marginBottom: theme.spacing(2),
          display: "flex",
        },
        titleExtras: {
          marginLeft: theme.spacing(2),
          fontWeight: 300,
        },
        spacer: {
          height: theme.spacing(6),
        },
        fab: {
          position: "fixed",
          right: `${positionButton}px`,
          bottom: `${positionButton}px`,
          padding: `${paddingButton}px`,
        },
        fabIcon: {
          marginRight: theme.spacing(1),
        },
      };
    },
    { name: "ProjectPerf" }
  );
}
