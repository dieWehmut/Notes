<template>
  <div class="home-container">
    <div class="home-content">
      <aside class="sidebar">
        <div class="sidebar-widget profile-widget">
          <img src="../assets/avatar.jpg" alt="头像" class="avatar" />
          <h3>dieSW</h3>
          <p>{{ articles.length }} 篇文章</p>
        </div>
        
        <div class="sidebar-widget">
          <h3>最新文章</h3>
          <ul class="recent-articles">
            <li v-for="article in recentArticles" :key="article.id">
              <router-link :to="'/article/' + article.id">{{ article.title }}</router-link>
              <span class="article-date">{{ formatDate(article.date) }}</span>
            </li>
          </ul>
        </div>
        
        <div class="sidebar-widget">
          <h3>访问统计</h3>
          <div class="stats">
            <p>今日访客: <span class="stat-number">{{ todayVisitors }}</span></p>
            <p>总访客: <span class="stat-number">{{ totalVisitors }}</span></p>
            <p>最后更新: <span class="stat-number">{{ lastUpdate }}</span></p>
          </div>
        </div>
      </aside>

      <main class="articles-list">
        <div v-for="article in articles" :key="article.id" class="article-card">
          <router-link :to="'/article/' + article.id" class="article-title-link">
            <h2>{{ article.title }}</h2>
          </router-link>
          <p class="article-date">{{ formatDate(article.date) }}</p>
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
          title: 'Vue3组合式API深入理解',
          date: '2023-10-15',
          excerpt: '本文详细介绍了Vue3组合式API的使用方法和最佳实践，帮助你更好地组织代码逻辑。'
        },
        {
          id: 'article2',
          title: 'GitHub Pages部署完全指南',
          date: '2023-09-22',
          excerpt: '一步步教你如何将静态网站部署到GitHub Pages，并配置自定义域名和HTTPS。'
        },
        {
          id: 'article3',
          title: '前端性能优化策略',
          date: '2023-08-30',
          excerpt: '分享一系列前端性能优化的实用技巧，从资源加载到代码执行的全方位优化。'
        }
      ],
      todayVisitors: 0,
      totalVisitors: 0,
      lastUpdate: ''
    };
  },
  computed: {
    recentArticles() {
      return this.articles.slice(0, 2);
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
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.profile-widget {
  text-align: center;
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
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
}

.recent-articles {
  list-style: none;
  padding: 0;
}

.recent-articles li {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
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
}

.recent-articles a:hover {
  text-decoration: underline;
}

.article-date {
  font-size: 0.85rem;
  color: #777;
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
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
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
  color: #666;
  line-height: 1.6;
  margin: 10px 0 0 0;
}

@media (max-width: 768px) {
  .home-content {
    flex-direction: column;
  }
  
  .sidebar {
    flex: 1;
  }
}
</style>