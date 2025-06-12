import { View, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import CardPost from "../components/CardPost";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const posts = [
  {
    id: "1",
    content: "sepatu hitam",
    tag: "sepatu",
    imgUrl:
      "https://www.pedroshoes.co.id/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-pd_id-products/default/dwbb0c0f3e/images/hi-res/2024-L7-PM1-46380087-01-1.jpg?sw=1152&sh=1536",
    authorId : "fahri"
  },
  {
    id: "2",
    content: "sepatu putih",
    tag: "sepatu",
    imgUrl:
      "https://www.pedroshoes.co.id/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-pd_id-products/default/dwbb0c0f3e/images/hi-res/2024-L7-PM1-46380087-01-1.jpg?sw=1152&sh=1536",
    authorId : "fahri"
  },
  {
    id: "3",
    content: "sepatu merah",
    tag: "sepatu",
    imgUrl:
      "https://www.pedroshoes.co.id/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-pd_id-products/default/dwbb0c0f3e/images/hi-res/2024-L7-PM1-46380087-01-1.jpg?sw=1152&sh=1536",
    authorId : "fahri"
  },
  {
    id: "4",
    content: "sepatu biru",
    tag: "sepatu",
    imgUrl:
      "https://www.pedroshoes.co.id/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-pd_id-products/default/dwbb0c0f3e/images/hi-res/2024-L7-PM1-46380087-01-1.jpg?sw=1152&sh=1536",
    authorId : "fahri"
  }
];

export default function Home() {

  const navigation = useNavigation();
  return (
    <SafeAreaView >
      <FlatList 
        data={posts}
        renderItem={({ item }) => <CardPost post={item} />}
        keyExtractor={(post) => post.id}
       
      />
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            console.log("create post button pressed");
            navigation.push("Create");
          }}
        >
          <Ionicons name="add-circle" size={45} color="#06C755" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}