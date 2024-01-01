# crucio前端项目

## 快速开始

## 环境要求

- Node.js： v18.19.0 以上
- Pnpm： 8.12.1 以上

## 安装&运行

```bash
# 依赖安装
pnpm install

# 需先构建一次
您需要运行 pnpm run prebuild 命令来生成 ios/ 带有 android/ 本机代码的文件夹。
# 在模拟器运行ios dev环境
pnpm dev:ios

# 在模拟器运行android dev环境
pnpm dev:android

# 在模拟器expo go 运行 dev环境
pnpm start:ios
pnpm start:android
```

## 脚本说明

## 改造项目

- Expo SDK - 围绕 React Native 和原生平台构建的一组工具和服务。
- React Navigation （v6） - React Native 应用程序的路由和导航。
- Navio - React Native 的通用导航库.建立在 React Navigation 之上。
- RN UI lib - React Native 的惊人设计系统、UI 工具集和组件库.深色模式是使用此库实现的。
- Reanimated 2 - React Native 的动画库重新实现.
- MobX - 简单、可扩展的状态管理，使用 mobx-persist-store 来持久化您的存储.
- Flash List - React Native（通过Shopify）的更好列表。
- React Native Gesture Handler - React Native 的原生触摸和手势系统。
- Expo Image - 加载和渲染图像的跨平台 React 组件。
- MMKV - 微信开发的高效、小型移动键值存储框架。比 AsyncStorage 快 ~30 倍！仅在 Expo 开发客户端中可用。

- expo-status-bar - 包含一个名为 StatusBar 的组件，可以轻松地在应用程序中集成和管理状态栏的外观和行为。通过使用 expo-status-bar，你可以自定义状态栏的背景颜色、文字颜色、样式等
- expo-splash-screen 是一个用于在 Expo 应用程序中管理启动画面的库
- mobx-persist-store 用于本地持久化mbox数据
- expo-linking
- react-native-gesture-handler 取代 React Native 的内置触摸系统

## 文件目录结构

| App.tsx           --- 项目的根组件
| index.js          --- 项目的入口文件
| package.json      --- 项目的描述文件
| .eslintrc.js      --- eslint的配置化文件
| .prettierrc.js    --- 格式化配置文件
| android           --- 编译安卓相关
| ios               --- 编译ios相关

## 基础知识

### flex 布局

- 所有容器默认都是 flexbox
- 并且都是纵向排列，也就是flex-direction: column;

### 样式继承

背景色、字体颜色、字体大小等没有继承

### 单位

- 不能加 `px` 单位
- 不能加 `vw vh` 单位
- 可以加百分比单位

### 屏幕宽度和高度

### 标签

#### View

- 相当于web中的div
- 不支持设置字体大小、字体颜色等
- 不能直接放置文本内容
- 不支持直接绑定点击事件（一般使用TouchableOpacity 来代替）

#### Text

- 文本标签，可以设置字体颜色、大小等
- 支持绑定点击事件

#### TouchableOpacity
>
> 可以绑定点击事件的块级标签

- 相当于会计的容器
- 支持绑定点击事件 onPress
- 可以设置点击时的透明度

```tsx
<TouchableOpacity activeOpacity={0.5} onPress={handlePress}>

</TouchableOpacity>
```
