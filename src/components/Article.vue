<template>
  <div class="article-container">
    <header class="article-header">
      <h1 class="article-title">{{ articleTitle }} 📝</h1>
      <router-link to="/" class="home-link" title="返回首页">
        <svg viewBox="0 0 24 24" class="home-icon">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </router-link>
    </header>

    <div class="article-content">
      <aside class="table-of-contents">
        <h3>📋 目录</h3>
        <ul>
          <li v-for="(heading, index) in headings" :key="index" :class="['toc-item', 'toc-level-' + heading.level, { 'active': activeHeadingId === heading.id }]">
            <a :href="'#' + heading.id" @click.prevent="scrollToHeading(heading.id)">
              {{ heading.numberedText }}
            </a>
          </li>
        </ul>
      </aside>

      <div class="article-main">
        <div class="markdown-content" v-html="renderedMarkdown"></div>
        
        <div class="article-meta">
          <p><strong>✍️ 作者:</strong> {{ articleAuthor }}</p>
          <p><strong>🔗 文章链接:</strong> 
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
      currentUrl: window.location.href,
      activeHeadingId: '',
      headingElements: [],
      // 添加编号计数器
      headingCounters: [0, 0, 0, 0] // 支持h1到h3的计数
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
    // 添加滚动事件监听器
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    // 清理事件监听器
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async loadArticle(articleId) {
      try {
        // 使用动态import加载文章
        const articleModule = await import(`@assets/articles/${articleId}.md?raw`);
        const content = articleModule.default;
        
        const titleMatch = content.match(/^#\s+(.+)$/m);
        
        this.articleTitle = titleMatch ? titleMatch[1] : '未命名文章 📝';
        this.articleContent = content;
        document.title = this.articleTitle ;
      } catch (error) {
        console.error('加载文章失败:', error);
        this.articleTitle = '文章未找到 ❌';
        this.articleContent = '# 文章未找到\n\n抱歉，您请求的文章不存在。❌';
      }
    },
    extractHeadings() {
      // 重置计数器
      this.headingCounters = [0, 0, 0, 0];
      
      this.$nextTick(() => {
        const headingElements = this.$el.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3');
        
        // 先统计各级标题数量
        const levelCounts = [0, 0, 0, 0];
        Array.from(headingElements).forEach(heading => {
          const level = parseInt(heading.tagName.substring(1));
          if (level >= 1 && level <= 3) {
            levelCounts[level]++;
          }
        });
        
        this.headings = Array.from(headingElements).map((heading) => {
          const level = parseInt(heading.tagName.substring(1));
          const id = heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
          heading.id = id;
          
          // 更新计数器
          if (level >= 1 && level <= 3) {
            this.headingCounters[level]++;
            
            // 重置更深层级计数器
            for (let i = level + 1; i < this.headingCounters.length; i++) {
              this.headingCounters[i] = 0;
            }
          }
          
          // 生成编号文本
          let numberText = '';
          if (level >= 1 && level <= 3 && levelCounts[level] > 1) {
            // 只有当同级标题多于1个时才添加编号
            const numbers = [];
            for (let i = 1; i <= level; i++) {
              if (this.headingCounters[i] > 0) {
                numbers.push(this.headingCounters[i]);
              }
            }
            numberText = numbers.join('.') + ' ';
          }
          
          // 为不同级别的标题添加不同的emoji
          let emoji = '';
          switch(level) {
            case 1: emoji = '📌'; break;
            case 2: emoji = '🔹'; break;
            case 3: emoji = '🔸'; break;
            default: emoji = '🔸';
          }
          
          return {
            id,
            text: heading.textContent,
            level,
            numberedText: numberText + emoji + ' ' + heading.textContent
          };
        });
        
        // 保存标题元素引用
        this.headingElements = Array.from(headingElements);
        
        // 初始化激活的标题
        this.updateActiveHeading();
      });
    },
    scrollToHeading(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // 更新激活的标题
        this.activeHeadingId = id;
      }
    },
    handleScroll() {
      // 节流函数，避免频繁触发
      if (!this.throttleTimer) {
        this.throttleTimer = setTimeout(() => {
          this.updateActiveHeading();
          this.throttleTimer = null;
        }, 100);
      }
    },
    updateActiveHeading() {
      if (this.headingElements.length === 0) return;
      
      // 获取当前视口顶部位置
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const offset = windowHeight * 0.3; // 30%的窗口高度作为偏移
      
      // 查找当前视口中的标题
      let activeId = '';
      for (let i = this.headingElements.length - 1; i >= 0; i--) {
        const heading = this.headingElements[i];
        const headingTop = heading.offsetTop;
        
        if (headingTop <= scrollY + offset) {
          activeId = heading.id;
          break;
        }
      }
      
      this.activeHeadingId = activeId;
    }
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.loadArticle(newId);
      },
      immediate: true
    },
    renderedMarkdown: {
      handler() {
        this.extractHeadings();
      }
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
  font-weight: 600;
}

.home-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #555;
  transition: color 0.3s;
  border-radius: 50%;
  padding: 8px;
  background-color: rgba(52, 152, 219, 0.1);
}

.home-link:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.2);

}

.home-icon {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  fill: currentColor;
  z-index: 1000;
  transition: all 0.3s ease;
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
  border-radius: 12px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.table-of-contents h3 {
  margin-top: 0;
  color: #333;
  font-weight: 600;
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
  transition: all 0.3s;
  display: block;
  padding: 4px 8px;
  border-radius: 6px;
}

.table-of-contents a:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

.toc-level-2 {
  padding-left: 15px;
  font-size: 0.9em;
}

.toc-level-3 {
  padding-left: 30px;
  font-size: 0.85em;
}

/* 激活的目录项样式 */
.toc-item.active > a {
  color: #3498db;
  font-weight: bold;
  background-color: rgba(52, 152, 219, 0.2);
}

.article-main {
  flex: 1;
}

.markdown-content {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.article-meta {
  background: #f9f9f9;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
