<template>
  <nav class="navbar pr-1 pl-1 pt-2 pb-2">
    <div class="top">
      <span class="welcome">Welcome, Adam!</span>
      <a href="#">Sign Out</a>
    </div>
    <section class="navbar-section">
      <router-link to="/" class="btn btn-link navbar-brand">Bookmate</router-link>
      <router-link to="/library" class="btn btn-link">My Library</router-link>
    </section>
    <section class="navbar-section">
      <a href="#" class="btn btn-link">Settings</a>
    </section>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  position: relative;
  margin-top: 1rem;
  margin-bottom: 0.6rem;
  background: #f0f1f4;
  border-radius: 0.1rem;

  .btn-link {
    color: #667189;

    &:hover {
      color: #50596c;
    }
  }

  .top {
    position: absolute;
    top: -1.5rem;
    right: 0.6rem;
    color: #50596c;

    .welcome {
      margin-right: 0.5rem;
    }
  }
}
</style>
