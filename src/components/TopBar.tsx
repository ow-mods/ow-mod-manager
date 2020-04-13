import React from 'react';
import { AppBar, Toolbar, Container, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  right: {
    position: 'absolute',
    right: 0,
  },
}));
const TopBar: React.FunctionComponent = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <AppBar color="default">
        <Toolbar>
          <Container>{children}</Container>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </>
  );
};

export default TopBar;
