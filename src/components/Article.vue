<template>
  <div class="article-container">
    <header class="article-header">
      <h1 class="article-title">{{ articleTitle }}</h1>
      <router-link to="/" class="home-link" title="返回首页">
        <svg viewBox="0 0 24 24" class="home-icon">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </router-link>
    </header>

    <div class="article-content">
      <aside class="table-of-contents">
        <h3>目录</h3>
        <ul>
          <li v-for="(heading, index) in headings" :key="index" :class="'toc-level-' + heading.level">
            <a :href="'#' + heading.id" @click.prevent="scrollToHeading(heading.id)">
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </aside>

      <div class="article-main">
        <div class="markdown-content" v-html="renderedMarkdown"></div>
        
        <div class="article-meta">
          <p><strong>作者:</strong> {{ articleAuthor }}</p>
          <p><strong>文章链接:</strong> 
            <a :href="currentUrl" target="_blank">{{ currentUrl }}</a>
          </p>
        </div>
      </div>
    </div>

    <VisitorCounter />
  </div>
</template>

<script>
import { marked } from 'marked';
import VisitorCounter from './VisitorCounter.vue';

export default {
  name: 'Article',
  components: {
    VisitorCounter
  },
  data() {
    return {
      articleTitle: '',
      articleContent: '',
      articleAuthor: 'dieSW',
      headings: [],
      currentUrl: window.location.href
    };
  },
  computed: {
    renderedMarkdown() {
      return marked(this.articleContent || '');
    }
  },
  mounted() {
    const articleId = this.$route.params.id;
    this.loadArticle(articleId);
    
    // 提取标题
    this.$nextTick(() => {
      this.extractHeadings();
    });
  },
  methods: {
    async loadArticle(articleId) {
      try {
        const response = await fetch(`/articles/${articleId}.md`);
        if (!response.ok) throw new Error('文章未找到');
        
        const content = await response.text();
        const titleMatch = content.match(/^#\s+(.+)$/m);
        
        this.articleTitle = titleMatch ? titleMatch[1] : '未命名文章';
        this.articleContent = content;
        document.title = this.articleTitle + ' - dieSW的博客';
      } catch (error) {
        console.error('加载文章失败:', error);
        this.articleTitle = '文章未找到';
        this.articleContent = '# 文章未找到\n\n抱歉，您请求的文章不存在。';
      }
    },
    extractHeadings() {
      const headingElements = this.$el.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3');
      this.headings = Array.from(headingElements).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent,
          level: parseInt(heading.tagName.substring(1))
        };
      });
    },
    scrollToHeading(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.loadArticle(newId);
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.article-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 15px;
}

.article-title {
  font-size: 2rem;
  margin: 0;
  color: #333;
}

.home-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #555;
  transition: color 0.3s;
}

.home-link:hover {
  color: #3498db;
}

.home-icon {
  width: 32px;
  height: 32px;
  fill: currentColor;
}

.article-content {
  display: flex;
  gap: 30px;
}

.table-of-contents {
  flex: 0 0 250px;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
}

.table-of-contents h3 {
  margin-top: 0;
  color: #333;
}

.table-of-contents ul {
  list-style: none;
  padding: 0;
}

.table-of-contents li {
  margin-bottom: 8px;
}

.table-of-contents a {
  text-decoration: none;
  color: #555;
  transition: color 0.3s;
  display: block;
  padding: 2px 0;
}

.table-of-contents a:hover {
  color: #3498db;
}

.toc-level-2 {
  padding-left: 15px;
  font-size: 0.9em;
}

.toc-level-3 {
  padding-left: 30px;
  font-size: 0.85em;
}

.article-main {
  flex: 1;
}

.markdown-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.article-meta {
  background: #f9f9f9;
  padding: 15px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.article-meta p {
  margin: 8px 0;
}

@media (max-width: 768px) {
  .article-content {
    flex-direction: column;
  }
  
  .table-of-contents {
    position: static;
    max-height: none;
  }
}
</style>