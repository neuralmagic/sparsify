import { makeStyles } from "@material-ui/core/styles";

export default function makeHomeSideNavStyles() {
  return makeStyles(
    (theme) => {
      const paddingHoriz = theme.spacing(1);
      const paddingVert = theme.spacing(1);

      return {
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          width: `calc(100% - 2 * ${paddingHoriz}px)`,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: paddingHoriz,
          paddingRight: paddingHoriz,
          paddingBottom: paddingVert,
        },
        headerButton: {
          width: "40px",
          height: "40px",
          minWidth: "40px",
          minHeight: "40px",
          padding: 0,
          margin: 0,

          "& svg": {
            width: "28px",
            height: "28px",
          },
        },
        headerText: {
          flex: "1 0",
        },
        content: {
          flex: "1 0",
          width: "100%",
          position: "relative",
        },
        list: {
          width: "100%",
          padding: 0,
          margin: 0,
        },
        spacer: {
          width: "100%",
          height: theme.spacing(2),
        },
      };
    },
    { name: "ProjectSideNav" }
  );
}
