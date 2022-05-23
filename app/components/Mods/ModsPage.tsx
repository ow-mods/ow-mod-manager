import React from 'react';
import { Box, Typography, Card, Container } from '@material-ui/core';
import { useRecoilValue } from 'recoil';

import { modsText } from '../../helpers/static-text';
import ModRowSection from './ModRowSection';
import PageContainer from '../PageContainer';
import {
  enabledModList,
  installedModList,
  requiredModList,
  notInstalledModList,
  enabledAlphaModList,
  installedAlphaModList,
  requiredAlphaModList,
  notInstalledAlphaModList,
  settingsState,
} from '../../store';
import ModsToolbar from './ModsToolbar';

const ModsPage: React.FunctionComponent = () => {
  const inAlphaMode = useRecoilValue(settingsState).alphaMode;

  const enabledMods = useRecoilValue(
    inAlphaMode ? enabledAlphaModList : enabledModList
  );
  const installedMods = useRecoilValue(
    inAlphaMode ? installedAlphaModList : installedModList
  );
  const notInstalledMods = useRecoilValue(
    inAlphaMode ? notInstalledAlphaModList : notInstalledModList
  );
  const requiredMods = useRecoilValue(
    inAlphaMode ? requiredAlphaModList : requiredModList
  );

  const isEmpty =
    enabledMods.length +
      requiredMods.length +
      installedMods.length +
      notInstalledMods.length ===
    0;

  return (
    <PageContainer maxWidth={false}>
      <Container maxWidth="md">
        <ModsToolbar />
        <ModRowSection
          title={modsText.modSections.required}
          mods={requiredMods}
          highlighted
        />
        {isEmpty && (
          <Box mt={2}>
            <Card>
              <Typography variant="h6" align="center">
                {modsText.emptyModList}
              </Typography>
            </Card>
          </Box>
        )}
        <ModRowSection
          title={modsText.modSections.enabled}
          mods={enabledMods}
        />
        <ModRowSection
          title={modsText.modSections.installed}
          mods={installedMods}
        />
        <ModRowSection
          title={modsText.modSections.notInstalled}
          mods={notInstalledMods}
        />
      </Container>
    </PageContainer>
  );
};

export default ModsPage;
