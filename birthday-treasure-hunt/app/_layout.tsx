import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GameProvider } from "../context/gameContext";

export default function Layout() {

  return (

    <GestureHandlerRootView style={{flex:1}}>

      <GameProvider>

        <Stack
          screenOptions={{
            headerShown:false
          }}
        />

      </GameProvider>

    </GestureHandlerRootView>

  );

}