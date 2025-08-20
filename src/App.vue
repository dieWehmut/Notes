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
  background-color: #f8f9fa; /* 更柔和的背景色 */
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: #3498db;
  text-decoration: none; /* 移除下划线使链接更柔和 */
}

a:hover {
  text-decoration: underline; /* 悬停时显示下划线 */
}

/* 添加一些有趣的图标样式 */
.markdown-content h1::before {
  content: '📝 ';
}

.markdown-content h2::before {
  content: '📘 ';
}

.markdown-content h3::before {
  content: '📌 ';
}

.markdown-content p::first-letter {
  font-size: 1.5em;
  font-weight: bold;
  color: #3498db;
}

.markdown-content ul::before {
  content: '📋 ';
  margin-left: -1.5rem;
  float: left;
}

.markdown-content ol::before {
  content: '🔢 ';
  margin-left: -1.5rem;
  float: left;
}

.markdown-content blockquote::before {
  content: '💬 ';
  margin-left: -1.5rem;
  float: left;
}

.markdown-content code {
  background-color: #e9ecef; /* 更柔和的背景色 */
  padding: 0.2rem 0.4rem;
  border-radius: 5px; /* 更圆润的边角 */
  font-family: 'Courier New', monospace;
}

.markdown-content pre {
  background-color: #e9ecef; /* 更柔和的背景色 */
  padding: 1rem;
  border-radius: 8px; /* 更圆润的边角 */
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
  background-color: #f1f3f4; /* 更柔和的背景色 */
  border-radius: 0 8px 8px 0; /* 更圆润的边角 */
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border-radius: 8px; /* 更圆润的边角 */
  overflow: hidden; /* 确保边角圆润 */
}

.markdown-content th, .markdown-content td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.markdown-content th {
  background-color: #e9ecef; /* 更柔和的背景色 */
  font-weight: bold;
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 10px; /* 更圆润的边角 */
  margin: 1.5rem 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* 添加阴影使图片更柔和 */
}
</style>
