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
  settingsState,
} from '../../store';
import ModsToolbar from './ModsToolbar';

const ModsPage: React.FunctionComponent = () => {
  const enabledMods = useRecoilValue(enabledModList);
  const installedMods = useRecoilValue(installedModList);
  const notInstalledMods = useRecoilValue(notInstalledModList);
  const requiredMods = useRecoilValue(requiredModList);
  const settings = useRecoilValue(settingsState);

  const isEmpty =
    enabledMods.length +
      requiredMods.length +
      installedMods.length +
      notInstalledMods.length ===
    0;

  const isAlphaMissingPath = settings.alphaMode && !settings.alphaPath;

  return (
    <PageContainer maxWidth={false}>
      <Container maxWidth="md">
        <ModsToolbar />
        {!isAlphaMissingPath && (
          <ModRowSection
            title={modsText.modSections.required}
            mods={requiredMods}
            highlighted
          />
        )}
        {isEmpty && (
          <Box mt={2}>
            <Card>
              <Typography variant="h6" align="center">
                {modsText.emptyModList}
              </Typography>
            </Card>
          </Box>
        )}
        {isAlphaMissingPath && (
          <Box mt={2}>
            <Card>
              <Typography variant="h6" align="center">
                {modsText.missingAlphaPath}
              </Typography>
            </Card>
          </Box>
        )}
        {!isAlphaMissingPath && (
          <>
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
          </>
        )}
      </Container>
    </PageContainer>
  );
};

export default ModsPage;
