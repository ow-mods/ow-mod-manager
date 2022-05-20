import React from 'react';
import { Typography, Card, Container } from '@material-ui/core';
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
} from '../../store';
import ModsToolbar from './ModsToolbar';
import { alphaState } from '../../store';

const ModsPage: React.FunctionComponent = () => {
  const alpha = useRecoilValue(alphaState);
  
  const enabledMods = useRecoilValue(alpha ? enabledAlphaModList : enabledModList);
  const installedMods = useRecoilValue(alpha ? installedAlphaModList : installedModList);
  const notInstalledMods = useRecoilValue(alpha ? notInstalledAlphaModList : notInstalledModList);
  const requiredMods = useRecoilValue(alpha ? requiredAlphaModList : requiredModList);

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
          <div>
            <br/>
            <Card>
              <Typography variant="h6" align="center">
                {modsText.emptyModList}
              </Typography>
            </Card>
          </div>
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
