import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectSideNavSubMenuStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: theme.spacing(0.5),
        },
        addButton: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "32px",
          height: "32px",
          minWidth: "32px",
          padding: 0,
          margin: 0,

          "& svg": {
            fill: theme.palette.text.secondary,
            width: "20px",
            height: "20px",
          },
        },
      };
    },
    { name: "ProjectSideNavSubMenuTitle" }
  );
}
