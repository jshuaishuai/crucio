import { Icon, Image, makeStyles, Text } from '@rneui/themed';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  Platform,
  TextInput,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { Spacings, Colors } from 'react-native-ui-lib'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginUser } from '../../hooks/useLoginUser';
import { setRepliedMessage, useTUIChatContext } from '../../store';
import { MessageService } from './message_service';
import { VoiceButton } from './tui_message_voice_button';
import runes from 'runes';
import { useRepliedMessage } from '../../store/TUIChat/selector';
import { MessageUtils } from '../../utils/message';
import FastImage from 'react-native-fast-image';

interface TUIMessageInputInterface {
  loginUserID: string;
  convID: string;
  convType: number;
  driverName?: string;
  onEmojiTap: () => void;
  onToolBoxTap: () => void;
  hideAllPanel: () => void;
  showSound?: boolean;
  showFace?: boolean;
  showToolBox?: boolean;
}

export interface TUIMessageInputRef {
  getTextInputRef: () => React.MutableRefObject<TextInput | null>;
  addTextValue: (text: string) => void;
  deleteTextValue: () => void;
  hanldeSubmiting: () => void;
}

export const TUIMessageInput = forwardRef<
  TUIMessageInputRef,
  TUIMessageInputInterface
>((props: TUIMessageInputInterface, ref) => {
  const {
    convID,
    convType,
    driverName,
    hideAllPanel,
    showFace = true,
    showSound = false,
    showToolBox = true,
  } = props;
  const [text, setText] = useState<string>('');
  const repliedMessage = useRepliedMessage();
  const [showVoiceRecord, setShowVoiceRecord] = useState(false);
  const textInputRef = useRef<TextInput | null>(null);
  const loginUserInfo = useLoginUser(props.loginUserID);
  const { dispatch } = useTUIChatContext();
  const [inputHeight, setInputHeight] = useState(26);

  const messageService = new MessageService(dispatch, {
    userInfo: loginUserInfo,
    convID,
    convType,
  });

  const handleTextChange = (value: string) => {
    setText(value);
  };

  const handleContentSizeChange = (event) => {
    const { contentSize } = event.nativeEvent;
    if (contentSize.height > inputHeight) {
      setInputHeight(Math.min(contentSize.height, 100));
    }
    if(contentSize.height < inputHeight){
      setInputHeight(26);
    }
  };

  useImperativeHandle(ref, () => ({
    getTextInputRef: () => textInputRef,
    addTextValue: (newText: string) => {
      setText(text + newText);
    },
    deleteTextValue: () => {
      setText(runes(text).slice(0, -1).join(''));
    },
    hanldeSubmiting: () => hanldeSubmiting(),
  }));

  const hanldeSubmiting = (
    event?: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (text && text !== '') {
      sendTextMessage();
      setText('');
    }
    event?.preventDefault();
  };

  const sendTextMessage = () => {
    if (repliedMessage) {
      messageService.sendRepliedMessage(text, repliedMessage);
    } else {
      messageService.sendTextMessage(text);
    }
  };

  const sendSoundMessage = (soundPath: string, duration: number) => {
    // 解决android手机无法发送语音问题
    if (Platform.OS === 'android') {
      const newSoundPath = soundPath.replace('file:///', '');
      messageService.sendSoundMessage(newSoundPath, duration);
    } else {
      messageService.sendSoundMessage(soundPath, duration);
    }
  };

  const handleBackSpaceTap = () => {
    dispatch(
      setRepliedMessage({
        message: undefined,
      }),
    );
  };

  const getRepliedMessage = () => {
    return `${MessageUtils.getDisplayName(
      repliedMessage!,
    )}: ${MessageUtils.getAbstractMessageAsync(repliedMessage!)}`;
  };

  return (
    <SafeAreaView
      style={styles.safeAreaContainer}
      edges={['right', 'bottom', 'left']}>
      {repliedMessage && (
        <View style={styles.repliedMessageContainer}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={3}
            h3
            style={{ color: '#8f959e' }}>
            {getRepliedMessage()}
          </Text>
          <Icon
            name={'clear'}
            size={18}
            color="#8f959e"
            onPress={handleBackSpaceTap}
          />
        </View>
      )}
      <View style={styles.rowContainer}>
        {showSound && (
          <Image
            ImageComponent={FastImage}
            source={
              showVoiceRecord
                ? require('../../../assets/keyboard.png')
                : require('../../../assets/voice.png')
            }
            style={styles.iconSize}
            onPress={() => {
              if (showVoiceRecord) {
                setTimeout(() => {
                  textInputRef.current?.focus();
                });
              } else {
                if (driverName) {
                  hideAllPanel();
                }
              }
              setShowVoiceRecord(!showVoiceRecord);
            }}
          />
        )}

        <View style={styles.inputContainer}>
          {showVoiceRecord ? (
            <VoiceButton onSend={sendSoundMessage} />
          ) : (
            <View style={styles.inputWarp}>
              <TextInput
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    if (repliedMessage && text === '') {
                      handleBackSpaceTap();
                    }
                  }
                }}
                ref={input => (textInputRef.current = input)}
                onChangeText={handleTextChange}
                onSubmitEditing={hanldeSubmiting}
                onContentSizeChange={handleContentSizeChange}
                style={[styles.input, { height: inputHeight }]}
                multiline
                returnKeyType="send"
                value={text}
              />
            </View>
          )}
        </View>
        {showFace && (
          <Image
            ImageComponent={FastImage}
            source={
              driverName === 'emoji'
                ? require('../../../assets/keyboard.png')
                : require('../../../assets/face.png')
            }
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.iconSize,
              marginRight: 10,
            }}
            onPress={() => {
              props.onEmojiTap();
              if (showVoiceRecord) {
                setShowVoiceRecord(false);
              }
            }}
          />
        )}
        {showToolBox && (
          <Image
            ImageComponent={FastImage}
            source={require('../../../assets/more.png')}
            style={styles.iconSize}
            onPress={props.onToolBoxTap}
          />
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: '#EDEDED',

  },
  iconSize: {
    height: 28,
    width: 28,
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    // height: 35,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    paddingTop: 10,
    // paddingBottom: 10,
  },
  inputWarp:{
    backgroundColor: '#fff',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 8,
    minHeight: 35,
    paddingTop: 4,
    paddingBottom: 4,

  },
  input: {
    // paddingLeft: 6,
    // textAlignVertical: 'middle',
    lineHeight: 16,
    fontSize: 16,
    // borderColor: 'red'
    borderRadius: 8,


  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,

  },
  repliedMessageContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#EDEDED',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})


