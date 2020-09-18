import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectSideNavSubMenuItemStyles() {
  return makeStyles(
    (theme) => {
      const paddingVert = theme.spacing(0.5);

      return {
        root: {
          position: "relative",
          width: "100%",
          padding: 0,
          margin: 0,
        },
        link: {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          textDecoration: "none",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: paddingVert,
          paddingBottom: paddingVert,
          margin: 0,
        },
        title: {
          color: ({ selected }) =>
            selected ? theme.palette.primary.light : theme.palette.text.secondary,
        },
        selectedIcon: {
          position: "absolute",
          fill: theme.palette.primary.light,
          width: "16px",
          height: "16px",
          left: "-16px",
        },
      };
    },
    { name: "ProjectSideNavSubMenuItem" }
  );
}
