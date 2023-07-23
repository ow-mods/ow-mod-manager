import React, { Fragment, useEffect, useState } from 'react';
import {
  makeStyles,
  Box,
  Container,
} from '@material-ui/core';
import { useRecoilValue } from 'recoil';
import { shell } from 'electron';
import {
  ModManagerAlert,
  getModManagerAlert,
} from '../services/get-mod-manager-alert';
import { settingsState } from '../store';

const useStyles = makeStyles((theme) => ({
  appAlert: {
    background: theme.palette.secondary.light,
    color: theme.palette.common.black,
    padding: theme.spacing(1),
  },
}));

type MessagePart = {
  id: number;
  type: 'url' | 'text';
  content: string[];
};

export const AppAlert = () => {
  const [alert, setAlert] = useState<ModManagerAlert>();

  const { alertSourceUrl } = useRecoilValue(settingsState);
  const styles = useStyles();

  useEffect(() => {
    const updateAlert = async () => setAlert(await getModManagerAlert(alertSourceUrl));
    updateAlert();
  }, [alertSourceUrl]);

  if (!alertSourceUrl || !alert || !alert.enabled) {
    return null;
  }

  const messageWords = alert.message.split(' ');
  const parsedMessage: MessagePart[] = [];
  let textPartIndex = 0;

  for (let index = 0; index < messageWords.length; index += 1) {
    const word = messageWords[index];

    if (word.startsWith('http')) {
      parsedMessage.push({
        id: textPartIndex,
        type: 'url',
        content: [word],
      });
      textPartIndex = parsedMessage.length;
    } else {
      if (!parsedMessage[textPartIndex]) {
        parsedMessage[textPartIndex] = {
          id: textPartIndex,
          type: 'text',
          content: [],
        };
      }
      parsedMessage[textPartIndex].content.push(word);
    }
  }

  const getTextPart = (messagePart: MessagePart) => {
    const content = messagePart.content.join(' ');
    if (messagePart.type === 'url') {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return <a href="#" onClick={() => shell.openExternal(content)}>{content}</a>;
    }
    return <span>{content}</span>;
  };

  return (
    <Box className={styles.appAlert}>
      <Container maxWidth="md">
        {parsedMessage.map((messagePart) => (
          <Fragment key={messagePart.id}>
            {getTextPart(messagePart)}
            {' '}
          </Fragment>
        ))}
      </Container>
    </Box>
  );
};
