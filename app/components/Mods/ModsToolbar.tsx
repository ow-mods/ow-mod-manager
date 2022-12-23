import React from 'react';
import { Paper, Toolbar, makeStyles, Button } from '@material-ui/core';
import { Folder as FolderIcon } from '@material-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';

import { modsText } from '../../helpers/static-text';
import FilterInput from '../FilterInput';
import {
  modFilterState,
  modTagsListState,
  modTagsSelectionState,
  settingsState,
} from '../../store';
import { openDirectory } from '../../services';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: `${theme.spacing(1)}px`,
  },
  toolBar: {
    justifyContent: 'space-between',
    minHeight: 0,
    padding: 0,
    marginBottom: `${theme.spacing(1)}px`,
    // padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  tagsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: `-${theme.spacing(0.5)}px 0 0 -${theme.spacing(0.5)}px`,
  },
  tag: {
    margin: `${theme.spacing(0.5)}px 0 0 ${theme.spacing(0.5)}px`,
    fontSize: '10px',
    lineHeight: '100%',
  },
}));

const ModsToolbar: React.FunctionComponent = () => {
  const styles = useStyles();
  const inAlphaMode = useRecoilValue(settingsState).alphaMode;
  const [filter, setFilter] = useRecoilState(modFilterState);
  const { owmlPath, alphaPath } = useRecoilValue(settingsState);
  const tags = useRecoilValue(modTagsListState);
  const [tagsSelection, setTagsSelection] = useRecoilState(
    modTagsSelectionState
  );

  return (
    <Paper className={styles.wrapper}>
      <Toolbar className={styles.toolBar}>
        <FilterInput
          value={filter}
          onChange={setFilter}
          label={modsText.toolbar.findModsLabel}
        />
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
      <div className={styles.tagsWrapper}>
        {tags.map((tag) => (
          <Button
            key={tag}
            size="small"
            className={styles.tag}
            onClick={() => {
              const selection = new Set(tagsSelection);
              if (tagsSelection.has(tag)) {
                selection.delete(tag);
              } else {
                selection.add(tag);
              }
              setTagsSelection(selection);
            }}
            variant={tagsSelection.has(tag) ? 'contained' : 'outlined'}
          >
            {tag}
          </Button>
        ))}
      </div>
    </Paper>
  );
};

export default ModsToolbar;
