import React from 'react';
import { Paper, Toolbar, makeStyles, Button } from '@material-ui/core';
import { Folder as FolderIcon } from '@material-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';

import { modsText } from '../../helpers/static-text';
import FilterInput from '../FilterInput';
import { modFilterState, settingsState, alphaState } from '../../store';
import { openDirectory } from '../../services';
import AlphaSwitch from './AlphaSwitch';

const useStyles = makeStyles((theme) => ({
  toolBar: {
    justifyContent: 'space-between',
    minHeight: 0,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

const ModsToolbar: React.FunctionComponent = () => {
  const styles = useStyles();
  const inAlphaMode = useRecoilValue(alphaState);
  const [filter, setFilter] = useRecoilState(modFilterState);
  const { owmlPath, alphaPath } = useRecoilValue(settingsState);
  return (
    <Paper>
      <Toolbar className={styles.toolBar}>
        <FilterInput
          value={filter}
          onChange={setFilter}
          label={modsText.toolbar.findModsLabel}
        />
        <AlphaSwitch />
        <Button
          startIcon={<FolderIcon />}
          onClick={() =>
            openDirectory(
              inAlphaMode ? `${alphaPath}/BepInEx/plugins` : `${owmlPath}/Mods`
            )
          }
          variant="outlined"
        >
          {modsText.toolbar.modsDirectory}
        </Button>
      </Toolbar>
    </Paper>
  );
};

export default ModsToolbar;
