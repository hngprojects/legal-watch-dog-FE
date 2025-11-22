<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="background-icon left-icon">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="3" opacity="0.4"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="3" opacity="0.4"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="3" opacity="0.4"/>
          <circle cx="100" cy="100" r="25" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>
      
      <div class="background-icon right-icon">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="3" opacity="0.4"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="3" opacity="0.4"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="3" opacity="0.4"/>
          <circle cx="100" cy="100" r="25" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>

      <div class="hero-content">
        <h2 class="hero-title">Gain your Strategic Advantage</h2>
        <p class="hero-subtitle">
          Stop reacting to change. Start predicting it. See how LegalWatchDog can transform your workflow with intelligence, and autonomous updates in real time.
        </p>
        <button class="hero-button" @click="handleClick">
          <span class="button-icon">+</span> Get Monitoring For Free
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const handleClick = () => {
  console.log("Monitoring started");
};
</script>

<style scoped>
.hero-section {
  width: 100%;
  padding: 4rem 1.5rem;
  background: transparent;
}

.hero-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #4a3424 0%, #3d2817 100%);
  border-radius: 16px;
  padding: 4rem 3rem;
  overflow: hidden;
}

.background-icon {
  position: absolute;
  width: 280px;
  height: 280px;
  color: #6b4f3a;
  pointer-events: none;
}

.left-icon {
  left: -80px;
  top: 50%;
  transform: translateY(-50%);
}

.right-icon {
  right: -80px;
  top: 50%;
  transform: translateY(-50%);
}

.background-icon svg {
  width: 100%;
  height: 100%;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1.25rem 0;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2rem 0;
  line-height: 1.6;
  font-weight: 400;
}

.hero-button {
  background: #f5e6d3;
  color: #3d2817;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.button-icon {
  font-size: 1.1rem;
  font-weight: 400;
}

.hero-button:hover {
  background: #eedcc3;
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.3);
}

.hero-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .hero-container {
    padding: 3rem 2rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .hero-button {
    padding: 0.7rem 1.75rem;
    font-size: 0.9rem;
  }

  .background-icon {
    width: 220px;
    height: 220px;
  }

  .left-icon {
    left: -100px;
  }

  .right-icon {
    right: -100px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 1rem;
  }

  .hero-container {
    padding: 2.5rem 1.5rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.85rem;
  }

  .background-icon {
    width: 180px;
    height: 180px;
  }
}
</style>