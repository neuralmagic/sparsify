import { makeStyles } from "@material-ui/core/styles";

export default function createHomeStyles() {
    return makeStyles(
        (theme) => {
            const paddingSides = theme.spacing(3);
            const paddingTopBot = theme.spacing(3);
            const paddingButton = theme.spacing(4);

            return {
                root: {
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                layout: {
                    position: "relative",
                    height: `calc(100% - 2 * ${paddingTopBot}px)`,
                    width: `calc(100% - 2 * ${paddingSides}px)`,
                    paddingTop: `${paddingTopBot}px`,
                    paddingBottom: `${paddingTopBot}px`,
                    paddingLeft: `${paddingSides}px`,
                    paddingRight: `${paddingSides}px`,
                },
                fab: {
                    position: "absolute",
                    bottom: `${paddingButton}px`,
                    right: `${paddingButton}px`,
                }
            };
        },
        { name: "Home" }
    );
}
