<template>
  <div class="home-container">
    <div class="home-content">
      <aside class="sidebar">
        <div class="sidebar-widget profile-widget">
          <h3>hc-dsw👤</h3>
          <p>📚 {{ files.length }} Notes</p>
        </div>
        
        <div class="sidebar-widget">
          <div class="stats">
            <p>🌐 Nexus : <a href="https://www.hc-dsw-nexus.me" target="_blank" class="stat-link">go to nexus</a></p>
            <p>📂 Source : <a href="https://git.nju.edu.cn/dieWehmut/learningmaterials/-/tree/main/Blog" target="_blank" class="stat-link">View all</a></p>
          </div>
        </div>
      </aside>

      <main class="articles-list">
        <div class="controls">
          <input v-model="q" type="search" placeholder="Search Notes..." class="search-input" />
          <select v-model="sortBy" class="sort-select" aria-label="Sort files">
            <option value="name">Sort: Name</option>
            <option value="ext">Sort: Type</option>
          </select>
        </div>
        <div v-if="loading" class="loading">
          <p>Loading file list... ⏳</p>
        </div>
        
        <div v-else-if="error" class="error">
          <p>❌ {{ error }}</p>
        </div>
        
        <div v-else>
          <div class="list-body">
            <div v-for="file in filteredFiles" :key="file.name" class="article-card">
              <div class="article-row">
                <a :href="file.rawUrl" target="_blank" rel="noopener noreferrer" class="article-title-link">
                  <h2>📄 {{ file.displayName }}</h2>
                </a>
                <div class="actions">
                  <button @click="viewFile(file.rawUrl)" class="btn-view" title="View raw file">View</button>
                  <button @click="copyLink(file.rawUrl, $event)" class="btn-copy" title="Copy raw link">Copy link</button>
                  <a :href="file.downloadUrl" target="_blank" rel="noopener noreferrer" class="btn-download" title="Open raw / Download">Download</a>
                </div>
              </div>
              <p class="file-info">
                <span class="file-type">📎 {{ file.extension }}</span>
              </p>
            </div>

            <div v-if="filteredFiles.length === 0" class="empty">
              <p>No files found 📭</p>
            </div>
          </div>
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
      files: [],
      loading: true,
      error: null,
      gitlabUrl: 'https://git.nju.edu.cn',
      projectPath: 'dieWehmut/learningmaterials',
      folderPath: 'Blog',
      rawBaseUrl: 'https://git.nju.edu.cn/dieWehmut/learningmaterials/-/raw/main/Blog',
      // UI state
      q: '',
      sortBy: 'name'
    };
  },
  mounted() {
    this.loadFilesFromGitLab();
  },
  computed: {
    filteredFiles() {
      const q = (this.q || '').trim().toLowerCase();
      let list = Array.isArray(this.files) ? this.files.slice() : [];
      if (q) {
        list = list.filter(f => {
          return (
            (f.name && f.name.toLowerCase().includes(q)) ||
            (f.displayName && f.displayName.toLowerCase().includes(q)) ||
            (f.extension && f.extension.toLowerCase().includes(q))
          );
        });
      }
      if (this.sortBy === 'name') {
        list.sort((a, b) => a.displayName.localeCompare(b.displayName));
      } else if (this.sortBy === 'ext') {
        list.sort((a, b) => {
          const e = a.extension.localeCompare(b.extension);
          return e !== 0 ? e : a.displayName.localeCompare(b.displayName);
        });
      }
      return list;
    }
  },
  methods: {
    async loadFilesFromGitLab() {
      try {
        this.loading = true;
        this.error = null;

        const projectId = encodeURIComponent(this.projectPath);
        const apiUrl = `${this.gitlabUrl}/api/v4/projects/${projectId}/repository/tree?path=${this.folderPath}&ref=main`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        this.files = data
          .filter(item => item.type === 'blob')
          .map(item => {
            const encodedName = encodeURIComponent(item.name);
            const raw = `${this.rawBaseUrl}/${encodedName}`;
            return {
              name: item.name,
              displayName: this.getDisplayName(item.name),
              path: item.path,
              rawUrl: raw,
              downloadUrl: `${raw}?inline=false`,
              extension: this.getFileExtension(item.name)
            };
          });

      } catch (error) {
        console.error('Failed to load file list:', error);
        this.error = 'Unable to load file list. Please check network connection or repository permissions';
      } finally {
        this.loading = false;
      }
    },
    async copyLink(url, event) {
      const btn = event && event.currentTarget ? event.currentTarget : null;
      const origText = btn ? btn.innerText : null;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        if (btn) {
          btn.innerText = 'Copied!';
          setTimeout(() => { btn.innerText = origText; }, 1400);
        }
      } catch (err) {
        console.error('Copy failed', err);
        if (btn) {
          btn.innerText = 'Failed';
          setTimeout(() => { btn.innerText = origText; }, 1400);
        }
      }
    },
    viewFile(url) {
      try {
        const newWindow = window.open(url, '_blank');
        if (newWindow) newWindow.opener = null;
      } catch (err) {
        console.error('Failed to open file', err);
      }
    },
    getDisplayName(filename) {
      return filename.replace(/\.[^/.]+$/, '');
    },
    getFileExtension(filename) {
      const ext = filename.split('.').pop().toUpperCase();
      return ext || 'FILE';
    }
  }
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-content {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  flex: 1 1 auto;
}

.sidebar {
  flex: 0 0 300px;
}

.articles-list {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.articles-list .list-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  padding-bottom: 20px;
}

.sidebar-widget {
  background: #e9ecef;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.profile-widget {
  text-align: center;
  background: #dee2e6;
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

.stats p {
  margin: 12px 0;
}

.stat-link {
  font-weight: bold;
  color: #3498db;
  text-decoration: none;
}

.stat-link:hover {
  text-decoration: underline;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  background: #f1f3f5;
  border-radius: 12px;
  color: #6c757d;
  font-size: 1.1rem;
}

.error {
  background: #ffe6e6;
  color: #d63031;
}

.article-card {
  background: #f1f3f5;
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
  display: block;
}

.article-title-link h2 {
  margin: 0 0 10px 0;
  color: #333;
  transition: color 0.3s;
}

.article-title-link:hover h2 {
  color: #3498db;
}

.file-info {
  margin: 10px 0 0 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.file-type {
  background: #dee2e6;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}
.search-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
}
.sort-select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #dfe6e9;
}
.article-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.actions {
  margin-left: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.btn-view, .btn-copy, .btn-download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  height: 36px;
  min-width: 96px;
  border-radius: 6px;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  box-sizing: border-box;
  text-decoration: none; /* for anchors */
  vertical-align: middle;
}

.btn-view {
  background: #6c757d; /* gray */
}
.btn-view:hover {
  background: #5a6268;
}
.btn-copy {
  background: #3498db;
}
.btn-copy:hover {
  background: #2c80c9;
}
.btn-download {
  background: #2ecc71;
}
.btn-download:hover {
  background: #28b765;
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
