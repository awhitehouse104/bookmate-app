<template>
  <nav class="navbar bg-secondary pl-2 pr-2 pt-1 pb-1">
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
  margin-top: 3rem;
  margin-bottom: 0.4rem;
  margin-left: -0.4rem;
  margin-right: -0.4rem;
  border-radius: 5rem;

  .top {
    position: absolute;
    top: -1.5rem;
    right: 0.9rem;
    color: #333;

    .welcome {
      margin-right: 0.5rem;
    }
  }
}
</style>
