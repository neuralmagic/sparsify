import { makeStyles } from "@material-ui/core/styles";

export default function makeHomeSideNavStyles() {
  return makeStyles(
    (theme) => {
      const paddingSides = theme.spacing(1);
      const paddingTopBot = theme.spacing(3);

      return {
        listRoot: {
          width: "100%",
        },
        projectCard: {
          width: `calc(100% - 2 * ${paddingSides}px)`,
          paddingLeft: `${paddingSides}px`,
          paddingRight: `${paddingSides}px`,
          textDecoration: "none",
        },
        projectCardTitle: {
          width: "100%",
        },
        noProjectTitle: {
          marginLeft: theme.spacing(1)
        },
        projectCardSubTitle: {
          width: "100%",
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
        },
      };
    },
    { name: "HomeSideNav" }
  );
}
