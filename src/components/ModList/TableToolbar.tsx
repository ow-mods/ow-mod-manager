import React from 'react';
import {
  createStyles, lighten, makeStyles, Theme,
} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';

interface Props {
  selected: string[];
}

const useToolbarStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const TableToolbar = (props: Props) => {
  const classes = useToolbarStyles();
  const { selected } = props;
  const numSelected = selected.length;

  return (
    <Toolbar className={`${classes.root} ${numSelected > 0 ? classes.highlight : ''}`}>
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected}
          {' '}
          selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Grab ya mods, bois
        </Typography>
      )}
      {numSelected > 0 ? (
        <ButtonGroup
          variant="outlined"
          color="primary"
        >
          <Tooltip title="Delete">
            <Button>
              Update
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button>
              Uninstall
            </Button>
          </Tooltip>
        </ButtonGroup>
      ) : (
        <Tooltip title="Filter list">
          <Button
            fullWidth
            color="primary"
            variant="contained"
          >
            Update all
          </Button>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default TableToolbar;
