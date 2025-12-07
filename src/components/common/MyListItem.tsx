import React from "react";
import { FlashList } from "@shopify/flash-list";

const MyListItem = ({
  data,
  renderItem,
  keyExtractor,
}: {
  data: any[];
  renderItem: ({ item }: { item: any }) => React.ReactElement;
  keyExtractor: (item: any) => string;
}) => {
  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default MyListItem;