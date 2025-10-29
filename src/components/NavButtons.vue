<template>
  <div class="nav-buttons">
  <button class="nav-btn" @click="go('search')">{{ t('nav.search') }}</button>
  <button class="nav-btn" @click="go('anime')">{{ t('nav.anime') }}</button>
  <button class="nav-btn" @click="go('manga')">{{ t('nav.manga') }}</button>
  <button class="nav-btn" @click="go('ln')">{{ t('nav.ln') }}</button>
  <button class="nav-btn" @click="go('game')">{{ t('nav.game') }}</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  const headerOffset = 90
  const rect = el.getBoundingClientRect()
  const docTop = window.pageYOffset || document.documentElement.scrollTop
  const top = rect.top + docTop - headerOffset
  window.scrollTo({ top, behavior: 'smooth' })
}

function go(name) {
    const map = {
    search: 'section-search',
    anime: 'section-anime',
    manga: 'section-manga',
    ln: 'section-ln',
    game: 'section-game',
  }
  const id = map[name]
  if (!id) return
  // If it's the search button, toggle the SearchBar instead of scrolling
  if (name === 'search') {
    try { window.dispatchEvent(new CustomEvent('toggle-search')) } catch (e) {}
    return
  }

  try {
    window.dispatchEvent(new CustomEvent('open-section', { detail: name }))
  } catch (e) {}
  // add small timeout so any listeners can react first
  setTimeout(() => scrollToSection(id), 120)
}

// keep exports simple; no props needed since behavior is self-contained
onMounted(() => {})
</script>

<style scoped>
.nav-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.nav-btn {
  /* 默认黑色半透明背景（在未悬浮时） */
  background: rgba(0,0,0,0.36);
  color: rgba(255,255,255,0.96);
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 100ms ease;
}
.nav-btn:hover {
  /* 悬浮后变为无色透明 */
  background: transparent !important;
}
.nav-btn:active {
  transform: translateY(1px);
}
.nav-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(64,158,255,0.14);
}
</style>
