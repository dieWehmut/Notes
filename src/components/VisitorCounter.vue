<template>
  <footer class="site-footer">
    <div class="survival-time">
      本站已存活 <span class="time-number">{{ days }}</span> 天 
      <span class="time-number">{{ hours }}</span> 时 
      <span class="time-number">{{ minutes }}</span> 分 
      <span class="time-number">{{ seconds }}</span> 秒
    </div>
    
    <div class="social-buttons">
      <a
        href="https://github.com/dieSehnsucht0"
        target="_blank"
        class="social-button github"
        title="dieSehnsucht0のGitHub"
      >
        <svg viewBox="0 0 24 24" class="social-icon">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </a>
      <a
        href="https://git.nju.edu.cn/dieSehnsucht"
        target="_blank"
        class="social-button gitlab"
        title="dieSehnsuchtのGitLab"
      >
        <svg viewBox="0 0 24 24" class="social-icon">
          <path
            d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"
          ></path>
        </svg>
      </a>
      <a
        href="https://github.com/dieWehmut"
        target="_blank"
        class="social-button github"
        title="dieWehmutのGitHub"
      >
        <svg viewBox="0 0 24 24" class="social-icon">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </a>
    </div>
    
    <div class="copyright">© 2025 dieSW</div>
  </footer>
</template>

<script>
export default {
  name: 'VisitorCounter',
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      startDate: new Date('2025-08-20') // 网站的启动日期
    };
  },
  mounted() {
    this.updateSurvivalTime();
    setInterval(this.updateSurvivalTime, 1000);
  },
  methods: {
    updateSurvivalTime() {
      const now = new Date();
      const diff = now - this.startDate;
      
      this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    }
  }
};
</script>

<style scoped>
.site-footer {
  text-align: center;
  padding: 30px 20px;
  margin-top: 50px;
  border-top: 1px solid #eaeaea;
  background-color: #f9f9f9;
}

.survival-time {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #555;
}

.time-number {
  font-weight: bold;
  color: #3498db;
  padding: 0 2px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f1f1f1;
  color: #555;
  transition: all 0.3s ease;
}

.social-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.social-button.github:hover {
  background-color: #333;
  color: white;
}

.social-button.gitlab:hover {
  background-color: #fc6d26;
  color: white;
}

.social-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.copyright {
  font-size: 0.9rem;
  color: #777;
}
</style>