export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteItems = ref<MenuItem[]>([]);

  const addFavorite = (item: MenuItem) => {
    if (!favoriteItems.value.some(fav => fav.route === item.route)) {
      favoriteItems.value.push(item);
    }
  };

  const removeFavorite = (item: MenuItem) => {
    favoriteItems.value = favoriteItems.value.filter(fav => fav.route !== item.route);
  };

  const isFavorite = (item: MenuItem) => {
    return favoriteItems.value.some(fav => fav.route === item.route);
  };

  return {
    favoriteItems,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
});
