import React from 'react';
import {
  createStyles, lighten, makeStyles, Theme,
} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';

interface Props {
  selected?: Mod;
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

  return (
    <Toolbar className={`${classes.root} ${selected !== undefined ? classes.highlight : ''}`}>
      {selected !== undefined ? (
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
