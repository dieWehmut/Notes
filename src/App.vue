<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: #3498db;
}

.markdown-content h1 {
  font-size: 2rem;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eaeaea;
}

.markdown-content h2 {
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem;
}

.markdown-content h3 {
  font-size: 1.25rem;
  margin: 1.25rem 0 0.75rem;
}

.markdown-content p {
  margin: 1rem 0;
  line-height: 1.7;
}

.markdown-content ul, .markdown-content ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

.markdown-content li {
  margin: 0.5rem 0;
}

.markdown-content code {
  background-color: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.markdown-content pre {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.markdown-content pre code {
  background: none;
  padding: 0;
}

.markdown-content blockquote {
  border-left: 4px solid #3498db;
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #555;
  font-style: italic;
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.markdown-content th, .markdown-content td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.markdown-content th {
  background-color: #f9f9f9;
  font-weight: bold;
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  margin: 1.5rem 0;
}
</style>