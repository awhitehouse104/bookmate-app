import VueRouter from 'vue-router';
import Home from './components/Home.vue'
import Dashboard from './components/Dashboard.vue'
import Book from './components/Book.vue'

const routes = [
  { name: 'home', path: '', component: Home },
  { name: 'library', path: '/library', component: Dashboard },
  { name: 'book', path: '/library/:id', component: Book }
]

const router = new VueRouter({routes})

export default router
