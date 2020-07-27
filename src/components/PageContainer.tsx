import { withStyles, Container } from '@material-ui/core';

const PageContainer = withStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    flex: 1,
    overflow: 'hidden scroll',
    display: 'flex',
    flexDirection: 'column',
  },
}))(Container);

export default PageContainer;
