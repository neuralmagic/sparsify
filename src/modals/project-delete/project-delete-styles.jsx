import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectStyles() {
  return makeStyles(
    (theme) => {
      return {
        content: {
          display: "flex",
          flexDirection: "column",
        },
        textInput: {
          width: "100%",
          maxWidth: "288px",
          marginTop: theme.spacing(2),
        },
        deleteButton: {
          color: theme.palette.error.main,
        },

        icon: {
          fill: theme.palette.text.secondary,
          marginBottom: theme.spacing(6),

          "& svg": {
            width: "200px",
            height: "200px",
          },
        },
        name: {
          display: "-webkit-box",
          lineClamp: 2,
          boxOrient: "vertical",
          overflow: "hidden",
        },
        desc: {
          marginTop: theme.spacing(2),
          display: "-webkit-box",
          lineClamp: 3,
          boxOrient: "vertical",
          overflow: "hidden",
        },
      };
    },
    { name: "Project" }
  );
}
