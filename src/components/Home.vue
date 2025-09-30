<template>
  <div class="home-container">
    <div class="home-content">
      <aside class="sidebar">
        <div class="sidebar-widget profile-widget">
          <img src="@assets/avatar.jpg" alt="头像" class="avatar" />
          <h3>dieSW 👤</h3>
          <p>📚 {{ articles.length }} 篇文章</p>
        </div>
        
        <div class="sidebar-widget">
          <h3>🆕 最新文章</h3>
          <ul class="recent-articles">
            <li v-for="article in recentArticles" :key="article.id">
              <router-link :to="'/article/' + article.id">{{ article.title }}</router-link>
              <span class="article-date">📅 {{ formatDate(article.date) }}</span>
            </li>
          </ul>
        </div>
        
        <div class="sidebar-widget">
          <h3>📊 网站数据</h3>
          <div class="stats">
            <p>👥 今日访客: <span class="stat-number">{{ todayVisitors }}</span></p>
            <p>📈 总访客: <span class="stat-number">{{ totalVisitors }}</span></p>
            <p>🕒 最后更新: <span class="stat-number">{{ lastUpdate }}</span></p>
          <p>🌐 总站:<a href="https://diewehmut.github.io" target="_blank" class="stat-link">点这里</a></p>
          </div>
        </div>
      </aside>

      <main class="articles-list">
        <!-- 草稿栏 -->
        <div class="draft-section">
          <h2>✏️ 草稿箱</h2>
          <div v-for="draft in drafts" :key="draft.id" class="article-card draft-card">
            <h3>{{ draft.title }}</h3>
            <p class="article-date">📅 {{ formatDate(draft.date) }}</p>
            <p class="article-excerpt">{{ draft.excerpt }}</p>
          </div>
        </div>
        
        <!-- 文章列表 -->
        <div v-for="article in reversedArticles" :key="article.id" class="article-card">
          <router-link :to="'/article/' + article.id" class="article-title-link">
            <h2>📖 {{ article.title }}</h2>
          </router-link>
          <p class="article-date">📅 {{ formatDate(article.date) }}</p>
          <p class="article-excerpt">{{ article.excerpt }}</p>
        </div>
      </main>
    </div>

    <VisitorCounter />
  </div>
</template>

<script>
import VisitorCounter from './VisitorCounter.vue';

export default {
  name: 'Home',  
  components: {
    VisitorCounter
  },
  data() {
    return {
      articles: [
        {
          id: 'article1',
          title: '人类是不是AI？',
          date: '2025-01-12',
          excerpt: '一旦 AI 进化成与人类难分辨、可混血的新物种 A，人类将打破“非 AI”定义，二者最终融合为 B，创造者与受造物的界限随之消失。'
        },
        {
          id: 'article2',
          title: '人机对齐与价值重构',
          date: '2025-06-15',
          excerpt: '当 AI 进化为可生殖、有自主价值观的新物种 A 并与人类融合成 B 时，“人对 AI 单向对齐”失效，必须预先重构多元价值体系以实现共存。'
        },
      ],
      drafts: [
        {
          id: 'draft1',
          title: 'AI驱动编程心得',
          date: '2025-08-20',
          excerpt: '有点想法，有空再写'
        }
      ],
      todayVisitors: 0,
      totalVisitors: 0,
      lastUpdate: '2025-08-20'
    };
  },
  computed: {
    recentArticles() {
      return this.articles.slice(0, 2);
    },
    reversedArticles() {
      // 返回反转后的文章列表，使最新文章在上面
      return [...this.articles].reverse();
    }
  },
  mounted() {
    this.loadVisitorData();
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('zh-CN', options);
    },
    async loadVisitorData() {
      try {
        const response = await fetch('/visit.json');
        if (!response.ok) throw new Error('无法加载访问数据');
        
        const data = await response.json();
        this.todayVisitors = data.todayVisitors;
        this.totalVisitors = data.totalVisitors;
        this.lastUpdate = data.lastUpdate;
      } catch (error) {
        console.error('加载访问数据失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa; /* 浅灰背景 */
}

.home-content {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.sidebar {
  flex: 0 0 300px;
}

.articles-list {
  flex: 1;
}

.sidebar-widget {
  background: #e9ecef; /* 更浅的灰色 */
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.profile-widget {
  text-align: center;
  background: #dee2e6; /* 个人资料区域使用稍深一点的浅色 */
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.sidebar-widget h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #ced4da;
  padding-bottom: 10px;
  font-weight: 600;
}

.recent-articles {
  list-style: none;
  padding: 0;
}

.recent-articles li {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ced4da;
}

.recent-articles li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.recent-articles a {
  text-decoration: none;
  color: #3498db;
  font-weight: 500;
  display: block;
  margin-bottom: 5px;
  transition: all 0.3s;
  padding: 4px 8px;
  border-radius: 6px;
}

.recent-articles a:hover {
  text-decoration: underline;
  background-color: rgba(52, 152, 219, 0.1);
}

.article-date {
  font-size: 0.85rem;
  color: #6c757d;
}

.stats p {
  margin: 12px 0;
  display: flex;
  justify-content: space-between;
}

.stat-number {
  font-weight: bold;
  color: #3498db;
}

.article-card {
  background: #f1f3f5; /* 使用更浅的背景色 */
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  transition: all 0.3s;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.article-title-link {
  text-decoration: none;
  color: inherit;
}

.article-title-link h2 {
  margin: 0 0 10px 0;
  color: #333;
  transition: color 0.3s;
}

.article-title-link:hover h2 {
  color: #3498db;
}

.article-excerpt {
  color: #6c757d;
  line-height: 1.6;
  margin: 10px 0 0 0;
}

.draft-section {
  margin-bottom: 40px;
}

.draft-section h2 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px dashed #6c757d;
}

.draft-card {
  background: #fff3cd; /* 草稿箱使用浅黄色 */
  border-left: 4px solid #ffc107;
}

@media (max-width: 768px) {
  .home-content {
    flex-direction: column;
  }
  
  .sidebar {
    flex: 1;
  }
}
.stat-number {
  font-weight: bold;
  color: #3498db;
}
.stat-link {
  font-weight: bold;
  color: #3498db;
  text-decoration: none;
}
.stat-link:hover {
  text-decoration: underline;
}
</style>
