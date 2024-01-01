import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View ,Text} from 'react-native-ui-lib';
import * as Linking from 'expo-linking';

import {
  configureDesignSystem,
  getNavigationTheme,
  getStatusBarBGColor,
  getStatusBarStyle,
} from '@app/utils/designSystem';
import { hydrateStores } from '@app/stores';
import { initServices } from '@app/services';
import { AppProvider } from '@app/utils/providers';
import { useAppearance } from '@app/utils/hooks';
import { NavioApp } from '@app/Navio';


LogBox.ignoreLogs([
  'Require',
  'Found screens with the same name nested inside one another.', // for navio in some cases
]);

const App = (): React.ReactNode=>{
  useAppearance();
  const [ready, setReady] = useState(false);
  // `onLaunch` performs actions that have to be done on app launch before displaying app UI.
  // If you need to make some api requests, load remote config, or some other "heavy" actions, you can use `@app/services/onLaunch.tsx`.
  const onLaunch = useCallback(async () => {
    await SplashScreen.preventAutoHideAsync();

    await hydrateStores();
    configureDesignSystem();
    await initServices();

    setReady(true);
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    onLaunch();
  }, [onLaunch]);

  const NotReady = useMemo(() => {
    // [Tip]
    // You can show loading state here.
    return <></>;
  }, [ready]);

  if (!ready) return NotReady;
  return (
    // 取代 React Native 的内置触摸系统
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 全局数据中心 */}
      <AppProvider>
        {/* 自定义状态栏的背景颜色、文字颜色、样式 */}
        {/* 状态栏是设备上显示有关时间、电池电量和网络连接状态等信息的区域 */}
        <StatusBar style={getStatusBarStyle()} backgroundColor={getStatusBarBGColor()} />
        {/* APP主屏幕内容区域 */}
        <NavioApp
          navigationContainerProps={{
            theme: getNavigationTheme(),
            linking: {
              prefixes: [Linking.createURL('/')],
            },

          }}
        />
        {/* <View><Text text30>我是姜帅帅</Text></View> */}
      </AppProvider>
    </GestureHandlerRootView>
  );
}

export default App;
