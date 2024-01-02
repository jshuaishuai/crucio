import { Navio } from 'rn-navio';
import { Settings } from '@app/screens/settings';
import { Example } from '@app/screens/_screen-sample';
import { AuthLogin } from './screens/auth/Login';
import {
    screenDefaultOptions,
    tabScreenDefaultOptions,
    getTabBarIcon,
    drawerScreenDefaultOptions,
} from '@app/utils/designSystem';
import { services } from '@app/services';
import { Main } from '@app/screens/main';
import {Playground} from '@app/screens/playground';
// import {PlaygroundFlashList} from '@app/screens/playground/flash-list';
// import {PlaygroundExpoImage} from '@app/screens/playground/expo-image';
import {Home} from './screens/Home';

const navio = Navio.build({
    screens: {
        Main,
        Settings,
        Example,
        AuthLogin,
        Playground,
        Home: {
            component: Home,
            options: (props)=>{
                return {
                    title: ''
                }
            }
        }
    },
    stacks: {
        Main: ['Settings'],
        MainStack: ['Home'],
        Auth: ['AuthLogin'],
        MatchTabStack: {
            screens: ['Playground'],
          },
        MineStack: ['Settings'],  
    },
    tabs: {
        // main 3 tabs
        AppTabs: {
            content: {
                MainTab: {
                    stack: 'MainStack',
                    options: () => ({
                        title: 'TA',
                        tabBarIcon: getTabBarIcon('MainTab'),
                    }),
                },
                MatchTab: {
                  stack: 'MatchTabStack',
                  options: () => ({
                    title: '匹配',
                    tabBarIcon: getTabBarIcon('MatchTab'),
                  }),
                },
                MineTab: {
                  stack: 'MineStack',
                  options: () => ({
                    title: services.t.do('mine.title'),
                    tabBarIcon: getTabBarIcon('SettingsTab'),
                    tabBarBadge: 23,
                  }),
                },
            },
        },
    },
    // drawers: {
    //     // main drawer
    //     MainDrawer: {
    //       content: {
    //         Main: {
    //           stack: 'MainStack',
    //           options: {
    //             drawerType: 'front',
    //           },
    //         },
    //         Example: {
    //           stack: ['Example'],
    //         },
    //         Playground: {
    //           stack: 'PlaygroundStack',
    //         },
    //         // Tabs: {
    //         //   tabs: 'TabsWithDrawer',
    //         // },
    //       },
    //     },
    //   },
    root: 'AppTabs',
    defaultOptions: {
        stacks: {
          screen: screenDefaultOptions,
        },
        tabs: {
          screen: tabScreenDefaultOptions,
        },
        drawers: {
          screen: drawerScreenDefaultOptions,
        },
      },
});

export const getNavio = () => navio;

export const NavioApp = navio.App;

