import React, { useState, useEffect } from 'react';
import {
  Paper,
  Toolbar,
  makeStyles,
  Select,
  MenuItem,
  TableRow,
  TableCell,
  Box,
} from '@material-ui/core';

import { modsText } from '../../static-text';
import { isInstalled, isOutdated } from '../../services';
import { useAppState } from '../../hooks';
import FilterInput from '../FilterInput';
import ModRowSection from './ModRowSection';

const useStyles = makeStyles({
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

enum SelectFilter {
  All = 'all',
  Installed = 'installed',
  Enabled = 'enabled',
  NotInstalled = 'notInstalled',
  Outdated = 'outdated',
}

const filterByText = (filter: string, mod: Mod) => {
  const lowerCaseFilter = filter.toLowerCase();
  const nameMatch = mod.name.toLowerCase().includes(lowerCaseFilter);
  const authorNatch = mod.author.toLowerCase().includes(lowerCaseFilter);
  const uniqueNameMatch = mod.uniqueName
    .toLowerCase()
    .includes(lowerCaseFilter);

  return nameMatch || authorNatch || uniqueNameMatch;
};

const filterBySelect = (filter: SelectFilter, mod: Mod) => {
  if (filter === SelectFilter.Installed) {
    return isInstalled(mod);
  }
  if (filter === SelectFilter.NotInstalled) {
    return !isInstalled(mod);
  }
  if (filter === SelectFilter.Enabled) {
    return mod.isEnabled;
  }
  if (filter === SelectFilter.Outdated) {
    return isOutdated(mod);
  }
  return true;
};

const ModTable: React.FunctionComponent = () => {
  const styles = useStyles();
  const { modMap } = useAppState();
  const [filter, setFilter] = useState('');
  const [selectFilter, setSelectFilter] = useState(SelectFilter.All);
  const [installedMods, setInstalledMods] = useState<Mod[]>([]);
  const [notInstalledMods, setNotInstalledMods] = useState<Mod[]>([]);
  const [requiredMods, setRequiredMods] = useState<Mod[]>([]);

  useEffect(() => {
    const filteredMods = Object.values(modMap).filter((mod) => {
      return filterByText(filter, mod) && filterBySelect(selectFilter, mod);
    });

    setInstalledMods(filteredMods.filter((mod) => mod.localVersion));
    setNotInstalledMods(
      filteredMods.filter((mod) => !mod.localVersion && !mod.isRequired),
    );
    setRequiredMods(
      filteredMods.filter((mod) => mod.isRequired && !mod.localVersion),
    );
  }, [filter, selectFilter, modMap]);

  const handleSelectFilterChange = ({
    target,
  }: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => {
    setSelectFilter(target.value as SelectFilter);
  };

  const isEmpty = installedMods.length + notInstalledMods.length === 0;

  return (
    <Box flex="1">
      <Toolbar component={Paper} className={styles.toolBar}>
        <FilterInput value={filter} onChange={setFilter} />
        <div>
          <Select
            value={selectFilter}
            onChange={handleSelectFilterChange}
            color="secondary"
          >
            {Object.values(SelectFilter).map((value) => (
              <MenuItem key={value} value={value}>
                {modsText.selectFilter[value]}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Toolbar>
      <ModRowSection
        title={modsText.modSections.required}
        mods={requiredMods}
        highlighted
      />
      {isEmpty && (
        <TableRow>
          <TableCell>{modsText.emptyModList}</TableCell>
        </TableRow>
      )}
      <ModRowSection
        title={modsText.modSections.installed}
        mods={installedMods}
      />
      <ModRowSection
        title={modsText.modSections.notInstalled}
        mods={notInstalledMods}
      />
    </Box>
  );
};

export default ModTable;
