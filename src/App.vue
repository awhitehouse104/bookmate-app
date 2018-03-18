<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'app',
  components: {
    Navbar,
    Dashboard
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Slabo+27px');
@import "~spectre.css/src/spectre";
@import "~spectre.css/dist/spectre-icons";
@import "~vue-wysiwyg/dist/vueWysiwyg.css";

#app {
  width: 800px;
  max-width: 90%;
  margin: 0 auto;
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Slabo 27px', serif;
  box-sizing: border-box;
}

img {
  max-width: 100%;
}

.flex {
  flex: 1;
}

.breadcrumb-item a {
  text-decoration: underline;
}

.mb-3 {
  margin-bottom: 0.6rem;
}

.mb-4 {
  margin-bottom: 0.8rem;
}

.mb-5 {
  margin-bottom: 1rem;
}
</style>
