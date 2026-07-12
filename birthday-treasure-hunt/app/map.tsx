import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function MapScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🗺 Treasure Map
      </Text>

      <Text style={styles.level}>🏠 Level 1</Text>

      <Text style={styles.level}>🌳 Level 2</Text>

      <Text style={styles.level}>🌉 Level 3</Text>

      <Text style={styles.level}>🌊 Level 4</Text>

      <Text style={styles.level}>🏆 Treasure</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#E9F8F2",
    padding:30
  },

  title:{
    fontSize:30,
    fontWeight:"bold",
    marginBottom:30
  },

  level:{
    fontSize:24,
    marginVertical:15
  }
});