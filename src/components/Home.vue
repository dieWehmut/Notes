<script setup>
import { computed, ref, watch, onBeforeUnmount, nextTick } from "vue";
import { useI18n } from 'vue-i18n';
import { Collection, Link, ArrowUp } from "@element-plus/icons-vue";

import { ElMessage } from "element-plus";
import { showCenteredToast } from '../utils/centerToast'

import SearchBar from './SearchBar.vue'

const emit = defineEmits(['update:query'])

const props = defineProps({
  query: {
    type: String,
    default: "",
  },
  enterReady: {
    type: Boolean,
    default: true,
  },
});
import { useContent } from "../data/content";

const { ln, anime, manga, games } = useContent();

// helpers: parse dates and get latest version date for an item
function parseDateSafe(d) {
  try {
    const dt = new Date(d);
    return isNaN(dt.valueOf()) ? null : dt;
  } catch {
    return null;
  }
}

function latestVersionDate(item) {
  // If item is a plain string or has no versions, return epoch 0 (not recent)
  if (!item || typeof item === 'string' || !Array.isArray(item.versions) || item.versions.length === 0) return new Date(0);
  let max = 0;
  (item.versions || []).forEach((v) => {
    const dt = parseDateSafe(v.date);
    if (dt) {
      const t = dt.valueOf();
      if (t > max) max = t;
    }
  });
  return new Date(max || 0);
}



const totalCount = computed(() => (ln.value || []).length);

const totalGamesCount = computed(() => (games.value || []).length);

const totalAppsCount = computed(() =>
  manga.value.reduce((sum, a) => sum + (a.versions?.length || 0), 0)
);

const totalFilesCount = computed(() => (anime.value || []).length);

const normalizedQuery = computed(() => props.query.trim().toLowerCase());


function matchVersion(v, q) {
  return (
    (v.version || "").toLowerCase().includes(q) ||
    (v.log || "").toLowerCase().includes(q) ||
    (v.date || "").toLowerCase().includes(q)
  );
}

// Since content lists are now simple string arrays, treat filteredPages as filtered ln names
const filteredPages = computed(() => {
  const q = normalizedQuery.value;
  if (!q) return ln.value || [];
  return (ln.value || []).filter((name) => (name || "").toLowerCase().includes(q));
});

const filteredGames = computed(() => {
  const q = normalizedQuery.value;
  if (!q) return games.value || [];
  return (games.value || []).filter((name) => (name || "").toLowerCase().includes(q));
});

const filteredApps = computed(() => {
  const q = normalizedQuery.value;
  if (!q) return manga.value || [];
  return (manga.value || []).filter((name) => (name || "").toLowerCase().includes(q));
});

const filteredFiles = computed(() => {
  const q = normalizedQuery.value;
  if (!q) return anime.value || [];
  return (anime.value || []).filter((name) => (name || "").toLowerCase().includes(q));
});

const matchedCount = computed(() => (filteredPages.value || []).length);

const matchedGamesCount = computed(() => (filteredGames.value || []).length);

const matchedAppsCount = computed(() => (filteredApps.value || []).length);

const matchedFilesCount = computed(() => (filteredFiles.value || []).length);

// Tools: read child component (Tools.vue) exposed data via ref
const toolsRef = ref(null)
const toolsList = computed(() => toolsRef.value?.tools || [])
const filteredTools = computed(() => {
  const q = normalizedQuery.value
  if (!q) return toolsList.value
  return (toolsList.value || []).filter((t) => t.name.toLowerCase().includes(q))
})
const totalToolsCount = computed(() => (toolsList.value || []).length)
const matchedToolsCount = computed(() => (filteredTools.value || []).length)

// active lists are not applicable for the simplified string-only content; keep empty arrays
const activePages = ref([]);
const activeGames = ref([]);
const activeApps = ref([]);

const showPages = ref(true);
const showGames = ref(true);
const showApps = ref(true);
const showFiles = ref(true);
const showTools = ref(true);

// New show flags for the simplified sections (keep both sets for backward compatibility)
const showSearch = ref(true);
const showAnime = ref(true);
const showManga = ref(true);
const showLn = ref(true);
const showGame = ref(true);

// New empty content lists for the simplified line-by-line sections
const sectionSearchItems = ref([])
const sectionAnimeItems = ref([])
const sectionMangaItems = ref([])
const sectionLnItems = ref([])
const sectionGameItems = ref([])

// Search bar UI state (moved into Home top)
const showSearchBar = ref(false)
const searchBarRef = ref(null)
const localQuery = ref(props.query)

// sync prop -> local
watch(() => props.query, (v) => { localQuery.value = v })
// sync local -> parent
watch(localQuery, (v) => { emit('update:query', v) })

function handleToggleSearchEvent() {
  showSearchBar.value = !showSearchBar.value
  if (showSearchBar.value) {
    nextTick(() => {
      try { searchBarRef.value?.focus() } catch (e) {}
    })
  }
  try { window.dispatchEvent(new CustomEvent('search-visibility', { detail: showSearchBar.value })) } catch (e) {}
}

if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('toggle-search', handleToggleSearchEvent)
}

onBeforeUnmount(() => {
  try { window.removeEventListener('toggle-search', handleToggleSearchEvent) } catch (e) {}
})

// Populate simplified lists from the content sources (only show the `name` per user request)
import { watchEffect } from 'vue'

// Populate simplified lists from the content sources (only show the `name` per user request)

// Search -> aggregate all names from ln/anime/manga/games
watchEffect(() => {
  try {
  const lnNames = (ln?.value || []).map((p) => (typeof p === 'string' ? p : p.name || ""));
  const animeNames = (anime?.value || []).map((a) => (typeof a === 'string' ? a : a.name || ""));
  const mangaNames = (manga?.value || []).map((m) => (typeof m === 'string' ? m : m.name || ""));
  const gameNames = (games?.value || []).map((g) => (typeof g === 'string' ? g : g.name || ""));
    sectionSearchItems.value = [...lnNames, ...animeNames, ...mangaNames, ...gameNames];
  } catch (e) {
    sectionSearchItems.value = [];
  }
});

// anime -> anime names
watchEffect(() => {
  try {
  sectionAnimeItems.value = (anime?.value || []).map((a) => (typeof a === 'string' ? a : a.name || ""));
  } catch (e) {
    sectionAnimeItems.value = [];
  }
});

// manga -> manga names
watchEffect(() => {
  try {
  sectionMangaItems.value = (manga?.value || []).map((m) => (typeof m === 'string' ? m : m.name || ""));
  } catch (e) {
    sectionMangaItems.value = [];
  }
});

// ln -> ln names
watchEffect(() => {
  try {
  sectionLnItems.value = (ln?.value || []).map((p) => (typeof p === 'string' ? p : p.name || ""));
  } catch (e) {
    sectionLnItems.value = [];
  }
});

// game -> games names
watchEffect(() => {
  try {
  sectionGameItems.value = (games?.value || []).map((g) => (typeof g === 'string' ? g : g.name || ""));
  } catch (e) {
    sectionGameItems.value = [];
  }
});

function handleOpenSection(e) {
  const name = e?.detail;
  if (!name) return;

  // New simplified section names from NavButtons
  if (name === 'search') showSearch.value = true;
  if (name === 'anime') showAnime.value = true;
  if (name === 'manga') showManga.value = true;
  if (name === 'ln') showLn.value = true;
  if (name === 'game') showGame.value = true;
}

if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('open-section', handleOpenSection);
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && window.removeEventListener) {
    window.removeEventListener('open-section', handleOpenSection);
  }
});

watch(normalizedQuery, (q) => {
  try {
    // when query is empty, show all sections
    if (!q || q.length === 0) {
      showSearch.value = true;
      showAnime.value = true;
      showManga.value = true;
      showLn.value = true;
      showGame.value = true;
      return;
    }

    // when query exists, show only sections that have matches
    const anyPages = (filteredPages.value || []).length > 0;
    const anyGames = (filteredGames.value || []).length > 0;
    const anyApps = (filteredApps.value || []).length > 0;
    const anyFiles = (filteredFiles.value || []).length > 0;
    const anyTools = (filteredTools.value || []).length > 0;

    showSearch.value = anyPages || anyGames || anyApps || anyFiles || anyTools;
    showAnime.value = anyFiles;
    showManga.value = anyApps;
    showLn.value = anyPages;
    showGame.value = anyGames;
  } catch (e) {
    // ignore
  }
});

function openPage(url) {
  if (url) window.open(url, "_blank", "noopener");
}

function openFirstResult() {
  const first = firstVersion();
  if (first) {
    window.open(first.url, "_blank", "noopener");
  } else {
    ElMessage.info("No result to open");
  }
}

function copyFirstResult() {
  const first = firstVersion();
  if (first) {
      navigator.clipboard.writeText(first.url).then(() => {
      showCenteredToast('action.first_result_copied', { type: 'success', duration: 2500 });
    });
  } else {
    ElMessage.info("No result to copy");
  }
}

function firstVersion() {
  // Versions are not available in the simplified content model.
  // Keep this function but return null so callers gracefully handle lack of URL data.
  return null;
}

function formatDate(d) {
  try {
    const date = new Date(d);
    if (!isNaN(date.valueOf())) {
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const day = date.getDate();
      return `${y}-${m}-${day}`;
    }
  } catch {}
  return d;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

defineExpose({ openFirstResult, copyFirstResult });

// i18n helper for template
const { t } = useI18n();
</script>

<template>
  <div class="home" :class="{ 'entering': enterReady }">

    <!-- Inline SearchBar at top of Home (toggled via NavButtons -> dispatch 'toggle-search') -->
    <div style="margin-bottom:12px;">
      <SearchBar v-if="showSearchBar" ref="searchBarRef" v-model:modelValue="localQuery" />
    </div>

  <el-card v-if="showAnime" id="section-anime" shadow="never" class="home__card">
      <template #header>
        <div class="card-header" style="cursor: default;">
          <div class="card-header-left">
            <span>{{ t('nav.anime') }}</span>
          </div>
        </div>
      </template>
      <transition name="section-toggle">
        <div class="section-body">
          <div v-for="(item, idx) in sectionAnimeItems" :key="idx" class="line-item">{{ idx + 1 }}. {{ item }}</div>
        </div>
      </transition>
    </el-card>

  <el-card v-if="showManga" id="section-manga" shadow="never" class="home__card">
      <template #header>
        <div class="card-header" style="cursor: default;">
          <div class="card-header-left">
            <span>{{ t('nav.manga') }}</span>
          </div>
        </div>
      </template>
      <transition name="section-toggle">
        <div class="section-body">
          <div v-for="(item, idx) in sectionMangaItems" :key="idx" class="line-item">{{ idx + 1 }}. {{ item }}</div>
        </div>
      </transition>
    </el-card>

  <el-card v-if="showLn" id="section-ln" shadow="never" class="home__card">
      <template #header>
        <div class="card-header" style="cursor: default;">
          <div class="card-header-left">
            <span>{{ t('nav.ln') }}</span>
          </div>
        </div>
      </template>
      <transition name="section-toggle">
        <div class="section-body">
          <div v-for="(item, idx) in sectionLnItems" :key="idx" class="line-item">{{ idx + 1 }}. {{ item }}</div>
        </div>
      </transition>
    </el-card>

  <el-card v-if="showGame" id="section-game" shadow="never" class="home__card">
      <template #header>
        <div class="card-header" style="cursor: default;">
          <div class="card-header-left">
            <span>{{ t('nav.game') }}</span>
          </div>
        </div>
      </template>
      <transition name="section-toggle">
        <div class="section-body">
          <div v-for="(item, idx) in sectionGameItems" :key="idx" class="line-item">{{ idx + 1 }}. {{ item }}</div>
        </div>
      </transition>
    </el-card>

  

    <el-card
      v-if="
        query &&
        filteredPages.length === 0 &&
        filteredGames.length === 0 &&
        filteredApps.length === 0 &&
        filteredFiles.length === 0 &&
        filteredTools.length === 0
      "
      shadow="never"
      class="home__card"
    >
      <el-empty description="No matching content found" />
    </el-card>

  <!-- FloatButton moved to App.vue to make it global (viewport-fixed) -->
  </div>
</template>

<style scoped>
.home {
  /* remove top padding so the first card lines up with sidebar top (below header/layout padding) */
  padding: 0 0 0px;
  /* 保证主内容左右不带额外间距，与侧边栏无缝衔接 */
  margin: 0;
  padding-left: 0;
  padding-right: 0;
}
.home__card {
  border-radius: 10px;

}

/* entry animation for main content when intro finishes */
.home {
  transition: opacity 520ms cubic-bezier(.16,.9,.2,1), transform 520ms cubic-bezier(.16,.9,.2,1);
  will-change: opacity, transform;
}
.home:not(.entering) {
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
}
.home.entering {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.home__card { transition: opacity 420ms ease, transform 420ms cubic-bezier(.16,.9,.2,1); }
.home:not(.entering) .home__card { opacity: 0; transform: translateY(8px); }
.home.entering .home__card:nth-of-type(1) { transition-delay: 120ms }
.home.entering .home__card:nth-of-type(2) { transition-delay: 200ms }
.home.entering .home__card:nth-of-type(3) { transition-delay: 260ms }
.home.entering .home__card:nth-of-type(4) { transition-delay: 320ms }
.home.entering .home__card:nth-of-type(5) { transition-delay: 380ms }
.home.entering .home__card:nth-of-type(6) { transition-delay: 440ms }

/* Make the Tools card body transparent so the card itself is colorless; individual rows manage their own backgrounds */
#section-tools :deep(.el-card__body) {
  background: transparent !important;
  border: none !important;
  padding: 0; /* allow inner component to control padding */
}

.card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

/* Make the header area clearly clickable and span the full width (especially for GitHub activity card) */
.github-card .card-header {
  cursor: pointer;
  width: 100%;
  padding: 10px 0;
}
.card-header-left {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  width: 100%;
}
.repo-link {
  color: #6ba3f5;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 2px 6px;
  border-radius: 4px;
}
.repo-link:hover {
  color: #4a90e2;
  background: transparent !important;
}
.repo-icon {
  font-size: 12px;
}
.collapse :deep(.el-collapse-item__wrap) {
  background: transparent;
}
.single-title {
  font-weight: 600;
  font-size: 16px;
}
.single-date {
  color: #888;
  font-size: 13px;
}
.single-log {
  color: #2f3235;
  margin-left: 8px;
  font-size: 13px;
}



.section-body {
  overflow: hidden;
}

.section-toggle-enter-from,
.section-toggle-leave-to {
  max-height: 0;
  opacity: 0;
}

.section-toggle-enter-active,
.section-toggle-leave-active {
  transition: max-height 300ms ease, opacity 250ms ease;
}

.section-toggle-enter-to,
.section-toggle-leave-from {
  max-height: 1200px;
  opacity: 1;
}

/* Hover elevation for home cards (only on devices that support hover) */
@media (hover: hover) {
  .home__card {
    transition: transform 0.14s ease, box-shadow 0.18s ease;
    will-change: transform, box-shadow;
  }

  .home__card:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 40px rgba(0,0,0,0.28);
  }
}
</style>
