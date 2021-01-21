import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import makeStyles from "./display-card-styles";

const useStyles = makeStyles();

const DisplayCard = ({
  children,
  cardClassName,
  contentClassName,
  showMoreButton,
  moreDisabled,
  showEditButton,
  editDisabled,
  onMoreClick,
  onEditClick,
}) => {
  const classes = useStyles();

  return (
    <Card elevation={1} className={`${classes.card} ${cardClassName}`}>
      <CardContent className={`${classes.content} ${contentClassName}`}>
        {children}
      </CardContent>

      <div className={classes.actionButtons}>
        {showEditButton && (
          <IconButton
            className={classes.actionButton}
            onClick={onEditClick}
            size="small"
            disabled={editDisabled}
          >
            <EditIcon />
          </IconButton>
        )}
        {showMoreButton && (
          <IconButton
            className={classes.actionButton}
            onClick={onMoreClick}
            size="small"
            disabled={moreDisabled}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </div>
    </Card>
  );
};

DisplayCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
    .isRequired,
  cardClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  showMoreButton: PropTypes.bool,
  moreDisabled: PropTypes.bool,
  showEditButton: PropTypes.bool,
  editDisabled: PropTypes.bool,
  onMoreClick: PropTypes.func,
  onEditClick: PropTypes.func,
};

export default DisplayCard;
