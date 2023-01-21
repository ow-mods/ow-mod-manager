import React from 'react';
import {
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
  required: {
    border: `solid 3px ${theme.palette.secondary.light}`,
  },
  wrapper: {
    flex: 0,
    marginTop: theme.spacing(3),
  },
  modsTable: {
    tableLayout: 'fixed',
  },
}));

const ModRowSection: React.FunctionComponent<Props> = ({
  mods,
  title,
  highlighted,
}) => {
  const styles = useStyles();

  return mods.length > 0 ? (
    <div className={styles.wrapper}>
      <TableContainer
        component={Paper}
        className={highlighted ? styles.required : ''}
      >
        <Table className={styles.modsTable} size="small">
          <ModTableHead title={title} mods={mods} />
          <TableBody>
            {mods.map((mod: Mod) => (
              <ModTableRow
                mod={mod}
                key={mod.uniqueName}
                highlightedSection={highlighted}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : (
    <></>
  );
};

export default ModRowSection;
