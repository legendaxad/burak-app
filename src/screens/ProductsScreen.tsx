import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import {
  ChoiceChip,
  EmptyState,
  IconButton,
  LoadState,
  Page,
  ProductCard,
  ScreenHeader,
  SearchField,
  SectionTitle,
} from "@/components/AppUI";
import { useMockResource } from "@/hooks/use-mock-resource";
import { useRepositoryRefresh } from "@/hooks/use-repository-refresh";
import { burakRepository } from "@/services/burakRepository";
import type { ProductCategory } from "@/types/domain";

const categories = [
  "All",
  "Mains",
  "Soups",
  "Pasta",
  "Rice",
  "Desserts",
] as const;

export default function ProductsScreen() {
  const products = useMockResource(burakRepository.getProducts);
  useRepositoryRefresh("products", products.reload);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(
    () =>
      products.data?.filter((product) => {
        const matchesCategory =
          category === "All" || product.category === category;
        const matchesSearch =
          `${product.name} ${product.description} ${product.category}`
            .toLowerCase()
            .includes(query.trim().toLowerCase());
        return matchesCategory && matchesSearch;
      }) ?? [],
    [category, products.data, query],
  );

  return (
    <Page>
      <ScreenHeader
        title="Products"
        subtitle="Your menu, fresh and ready to serve."
        action={
          <IconButton
            icon="plus"
            label="Add product"
            onPress={() => router.push("/products/new")}
          />
        }
      />
      <View style={styles.content}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Search your menu"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((item) => (
            <ChoiceChip
              key={item}
              label={item}
              selected={category === item}
              onPress={() => setCategory(item as ProductCategory | "All")}
            />
          ))}
        </ScrollView>
        <SectionTitle
          title="Menu items"
          actionLabel={products.data ? `${filtered.length} items` : undefined}
        />
        {products.loading || !products.data ? (
          <LoadState error={products.error} onRetry={products.reload} />
        ) : filtered.length ? (
          filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/products/${product.id}`)}
            />
          ))
        ) : (
          <EmptyState
            title="No matching dishes"
            message="Try another search or category, or add a new item to the menu."
          />
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 14 },
  categoryList: { gap: 8, paddingRight: 4 },
});
