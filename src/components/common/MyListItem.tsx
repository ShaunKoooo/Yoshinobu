import React from "react";
import { FlashList } from "@shopify/flash-list";
import type { RefreshControlProps } from "react-native";

const MyListItem = ({
  data,
  renderItem,
  keyExtractor,
  refreshControl,
}: {
  data: any[];
  renderItem: ({ item }: { item: any }) => React.ReactElement;
  keyExtractor: (item: any) => string;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}) => {
  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={refreshControl}
    />
  );
};

export default MyListItem;