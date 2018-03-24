<template>
  <div id="dashboard">
    <ul class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/library">My Library</router-link>
      </li>
    </ul>

    <ul class="tab tab-block mb-4">
      <li class="tab-item" :class="{active: tab === 'myBooks'}">
        <a href="#" @click.prevent="setTab('myBooks')">My Books</a>
      </li>
      <li class="tab-item" :class="{active: tab === 'findBook'}">
        <a href="#" @click.prevent="setTab('findBook')">Find a Book</a>
      </li>
    </ul>

    <section class="search" v-if="tab === 'findBook'">
      <div class="lookup mb-5">
        <div class="form-group mt-2">
          <div class="has-icon-right">
            <input class="form-input" type="text" ref="lookup" @input="lookup" v-model="lookupText" placeholder="find a book...">
            <i class="form-icon icon icon-cross c-hand" v-show="bookSearch.length || lookupText" @click.prevent="clearSearch()"></i>
          </div>
        </div>
      </div>

      <div class="loading loading-lg" v-show="searchLoading"></div>

      <div class="search-results" v-if="bookSearch.length">
        <div class="tile mb-2" v-for="(book, index) in bookSearch" :key="index">
          <div class="tile-icon">
            <img :src="book.imageLinks.smallThumbnail" />
          </div>
          <div class="tile-content">
            <h5 class="tile-title mb-1">{{book.title}}</h5>
            <p class="tile-subtitle text-gray">{{book.authors.join(', ')}}</p>
          </div>
          <div class="tile-action">
            <button class="btn btn-primary btn-action" @click.prevent="addToCollection(book)">
              <i class="icon icon-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <main v-if="tab === 'myBooks'">
      <div class="empty-state" v-if="!books.length">
        <p class="text-gray" v-if="!booksLoading">You don't have any books in your library yet. Use the search bar above to get started.</p>
        <div class="loading loading-lg" v-if="booksLoading"></div>
      </div>
      <div class="books" v-if="books.length">
        <router-link :to="{name: 'book', params: {id: book.bookId}}" v-for="(book, index) in books" :key="index">
          <img class="book-image" :src="book.imageLinks.thumbnail" />
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'Dashboard',
  data() {
    return {
      tab: 'myBooks',
      books: [],
      bookSearch: [],
      lookupText: '',
      booksLoading: false,
      searchLoading: false
    }
  },
  methods: {
    setTab(tab) {
      this.tab = tab

      if (this.tab === 'findBook') {
        setTimeout(() => this.$refs.lookup.focus())
      } else {
        this.clearSearch()
      }
    },
    async getBooks() {
      try {
        this.booksLoading = true

        const response = await fetch('http://localhost:3001/books')
        const books = await response.json()

        this.books = books
      } catch(e) {
        console.log(e)
      } finally {
        this.booksLoading = false
      }
    },
    lookup: debounce(async function() {
      this.bookSearch = []
      
      if (this.lookupText) {
        try {
          this.searchLoading = true

          const response = await fetch(`http://localhost:3001/lookup?q=${this.lookupText}`)
          const books = await response.json()

          this.bookSearch = books
        } catch(e) {
          console.log(e)
        } finally {
          this.searchLoading = false
        }
      }
    }, 250),
    async addToCollection(book) {
      try {
        this.booksLoading = true

        const response = await fetch(`http://localhost:3001/book`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(book)
        })
        const bookRes = await response.json()

        this.books.push(bookRes)
        this.setTab('myBooks')
        this.clearSearch()
      } catch(e) {
        console.log(e)
      } finally {
        this.booksLoading = false
      }
    },
    clearSearch() {
      this.bookSearch = []
      this.lookupText = ''
    }
  },
  beforeMount() {
    this.getBooks()
  }
}
</script>

<style lang="scss" scoped>
.search-results {
  .tile {
    .tile-icon {
      max-width: 2rem;
    }

    .tile-content {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
  }
}

.book-image {
  border: 1px solid #e7e9ed;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(16.66% - 1rem));
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;

  .book-image {
    width: 100%;
  }
}
</style>
