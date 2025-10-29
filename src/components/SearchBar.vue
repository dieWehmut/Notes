<template>
  <div class="search-bar">
    <input
      ref="inputRef"
      :placeholder="computedPlaceholder"
      :value="modelValue"
      @input="onInput"
        @keydown.enter="onEnter"
        @focus="onFocus"
        @blur="onBlur"
      class="search-input"
      aria-label="search"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({ modelValue: { type: String, default: '' }, placeholder: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue', 'search'])
const { t } = useI18n()

// placeholder prefers explicit prop, otherwise use i18n key 'nav.search_placeholder'
const computedPlaceholder = computed(() => {
  if (props.placeholder && props.placeholder.length > 0) return props.placeholder
  // prefer existing search hint key, fallback to nav.search_placeholder
  const hint = t('search.hint')
  if (hint && hint !== 'search.hint') return hint
  return t('nav.search_placeholder')
})

const inputRef = ref(null)
function onInput(e) { emit('update:modelValue', e.target.value) }
function onEnter() { emit('search', props.modelValue) }
function focus() { inputRef.value && inputRef.value.focus() }
function onFocus() {
  try { window.dispatchEvent(new CustomEvent('search-visibility', { detail: true })) } catch (e) {}
}
function onBlur() {
  try { window.dispatchEvent(new CustomEvent('search-visibility', { detail: false })) } catch (e) {}
}
defineExpose({ focus })
</script>

<style scoped>
.search-bar { display: flex; width: 100%; justify-content: center; }
.search-input {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.36);
  color: #ffffff;
  caret-color: #ffffff;
  min-width: 420px;
  max-width: 920px;
  width: 68%;
  font-size: 16px;
  line-height: 1.2;
  box-shadow: 0 6px 18px rgba(0,0,0,0.24);
  transition: box-shadow 160ms ease, transform 160ms ease, background 120ms ease;
}
.search-input::placeholder { color: rgba(255,255,255,0.68); }
.search-input:focus {
  outline: none;
  box-shadow: 0 10px 30px rgba(64,158,255,0.12);
  transform: translateY(-2px);
  background: rgba(0,0,0,0.44);
}

@media (max-width: 1000px) {
  .search-input { width: 100%; min-width: 0; max-width: none; }
}
</style>