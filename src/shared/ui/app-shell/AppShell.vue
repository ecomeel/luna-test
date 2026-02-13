<template>
  <div class="shell">
    <header class="header">
      <div class="container header__inner">
        <div class="logo" @click="goHome" role="button" tabindex="0">
          <span class="logo__dot" />
          <span class="logo__title">Luna test</span>
        </div>
      </div>
    </header>

    <main class="container">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const goHome = () => router.push("/");
</script>

<style scoped lang="scss">
.shell { 
  min-height: 100vh; 
}

.header {
  position: sticky; 
  top: 0; 
  z-index: 10;
  background: white; 
  border-bottom: 1px solid #e5e7eb;

  &__inner {
    display: flex;
    align-items: center;
    height: 56px; 
  }
}

.logo { 
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #409eff;
    box-shadow: 0 0 0 4px rgba(64,158,255,.15);
  }

  &__title {
    font-weight: 800;
    letter-spacing: -0.02em;
  }
}
</style>