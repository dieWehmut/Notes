import { ref } from 'vue';

export function useContent() {
  // LN items: simplified as an array of names (strings)
  const ln = ref(["乐园NOISE"]);

  // Anime collection (names only)
  const anime = ref([]);

  // Manga collection (names only)
  const manga = ref([]);

  // Games (names only)
  const games = ref([]);

  return { ln, anime, manga, games };
}