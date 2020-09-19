import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectSettingsStyles() {
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
        title: {
          marginBottom: theme.spacing(2),
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
    { name: "ProjectSettings" }
  );
}
