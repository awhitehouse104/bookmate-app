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
$primary-color: #4183D7;

@import url('https://fonts.googleapis.com/css?family=Slabo+27px');
@import "~spectre.css/src/spectre";
@import "~spectre.css/dist/spectre-icons";
@import "~vue-wysiwyg/dist/vueWysiwyg.css";

html, body {
  height: 100%;
  background: #f0f1f4;
}

body {
  display: inline-block;
  width: 100%;
}

#app {
  width: 900px;
  max-width: 90%;
  margin: 0 auto;
  min-height: calc(100% - 3rem);
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 2rem;
  background: #fff;
  border-radius: 0.1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
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

.mb-3 {
  margin-bottom: 0.6rem;
}

.mb-4 {
  margin-bottom: 0.8rem;
}

.mb-5 {
  margin-bottom: 1rem;
}

.breadcrumb {
  margin-bottom: 0.4rem;
  padding: 0 0.4rem;
  border: 1px solid #e7e9ed;
  border-radius: 0.1rem;
}
</style>
