import { makeStyles } from "@material-ui/core/styles";

export default function makeHomeSideNavStyles() {
  return makeStyles(
    (theme) => {
      const paddingSides = theme.spacing(1);
      const paddingTopBot = theme.spacing(2);

      return {
        header: {
          width: `calc(100% - 2 * ${paddingSides}px)`,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: paddingSides,
          paddingRight: paddingSides,
          paddingTop: paddingTopBot,
        },
        headerButton: {
          width: "40px",
          height: "40px",
          minWidth: "40px",
          minHeight: "40px",
          padding: 0,
          margin: 0,
        },
        headerIcon: {
          width: "24px",
          height: "24px",
          marginLeft: "8px",
        },
        headerText: {
          flex: "1 0",
        },

        projectCard: {
          width: `calc(100% - 2 * ${paddingSides}px)`,
          paddingLeft: `${paddingSides}px`,
          paddingRight: `${paddingSides}px`,
          textDecoration: "none",
        },
        projectCardTitle: {

        },
        projectCardSubTitle: {

        },
        layout: {
          position: "relative",
          height: `calc(100% - 2 * ${paddingTopBot})`,
          width: `calc(100% - 2 * ${paddingSides})`,
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
    { name: "ProjectSideNav" }
  );
}
