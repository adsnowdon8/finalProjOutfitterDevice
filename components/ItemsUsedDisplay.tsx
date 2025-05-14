import { useMemo } from "react";
import { Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
export enum Category {
  Tops = "tops",
  Bottoms = "bottoms",
  Shoes = "shoes",
}
export type ClothingItem = {
  name: string;
  description?: string;
  imgFileUri: string;
  category: Category;
  // color: string;
  temperatureRange: [string, string];
};
export const ItemsUsedDisplay = ({
  itemsUsedObjs,
}: {
  itemsUsedObjs: (ClothingItem | null)[];
}) => {
  // order based on tops, bottoms, shoes
  const itemsUsedImgsOrdered = useMemo(
    () =>
      itemsUsedObjs
        .filter((item) => item !== null)
        .sort((a, b) => {
          if (a.category === "tops") return -1;
          if (b.category === "tops") return 1;
          if (a.category === "bottoms") return -1;
          if (b.category === "bottoms") return 1;
          if (a.category === "shoes") return -1;
          if (b.category === "shoes") return 1;
          return 0;
        }),
    [itemsUsedObjs]
  );
  const groupedByCategory = useMemo(() => {
    return itemsUsedImgsOrdered.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || []).concat(item);
      return acc;
    }, {} as Record<string, ClothingItem[]>);
  }, [itemsUsedImgsOrdered]);

  return (
    <ThemedView>
      {Object.entries(groupedByCategory).map(([category, catItems]) => (
        <ThemedView
          key={category}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
            width: "100%",
            flexWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          <ThemedText style={{ fontWeight: "bold", width: 70 }}>
            {category}
          </ThemedText>
          <ThemedView style={{ flexDirection: "row" }}>
            {catItems.map((item) => (
              <Image
                key={item.imgFileUri}
                style={{ width: 100, height: 100 }}
                source={{ uri: item.imgFileUri }}
              />
            ))}
          </ThemedView>
        </ThemedView>
      ))}
    </ThemedView>
  );
};
