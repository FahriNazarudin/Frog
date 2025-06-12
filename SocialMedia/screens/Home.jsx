import { View, Text, SafeAreaView, FlatList } from "react-native";
import CardPost from "../components/CardPost";

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
  return (
    <SafeAreaView>
      <FlatList
        data={posts}
        renderItem={({item}) => <CardPost post={item} />}
        keyExtractor={(post) => post.id}
      />
    </SafeAreaView>
  );
}