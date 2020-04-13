import React from 'react';
import { AppBar, Toolbar, Container, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const TopBar: React.FunctionComponent = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <AppBar color="default">
        <Toolbar>
          <Container className={classes.container}>{children}</Container>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </>
  );
};

export default TopBar;
