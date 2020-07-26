import React from 'react';
import {
  Typography,
  makeStyles,
  TableBody,
  Table,
  TableContainer,
  Paper,
} from '@material-ui/core';

import ModTableRow from './ModTableRow';
import ModTableHead from './ModTableHead';

type Props = {
  mods: Mod[];
  title: string;
  highlighted?: boolean;
};

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
  },
  required: {
    border: `solid 3px ${theme.palette.secondary.light}`,
  },
}));

const ModRowSection: React.FunctionComponent<Props> = ({
  mods,
  title,
  highlighted,
}) => {
  const styles = useStyles();

  return mods.length > 0 ? (
    <>
      <Typography
        className={styles.sectionTitle}
        variant="h6"
        color={highlighted ? 'secondary' : 'textSecondary'}
        align="center"
      >
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        className={highlighted ? styles.required : ''}
      >
        <Table size="small">
          <ModTableHead />
          <TableBody>
            {mods.map((mod: Mod) => (
              <ModTableRow mod={mod} key={mod.uniqueName} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    <></>
  );
};

export default ModRowSection;
