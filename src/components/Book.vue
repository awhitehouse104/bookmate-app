<template>
  <div id="book">
    <ul class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/library">My Library</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link :to="{name: 'book', params: {id: book.bookId}}">{{book.title}}</router-link>
        <span class="flex"></span>
        <a href="#" class="text-error" @click.prevent="confirmDeleteBook.show = true">Delete Book</a>
      </li>
    </ul>

    <ul class="tab tab-block mb-4">
      <li class="tab-item" :class="{active: tab === 'notes'}">
        <a href="#" @click.prevent="setTab('notes')">Notes</a>
      </li>
      <li class="tab-item" :class="{active: tab === 'addNote'}">
        <a href="#" @click.prevent="setTab('addNote')">Add a Note</a>
      </li>
    </ul>

    <section class="edit-note" v-if="tab === 'addNote'">
      <wysiwyg v-model="editNote.content" />
      <div class="actions">
        <button class="btn btn-primary mr-2" @click.prevent="saveNote()">Save Note</button>
        <button class="btn" @click.prevent="setTab('notes')">Cancel</button>
      </div>
    </section>

    <main v-show="tab === 'notes'">
      <div class="empty-state" v-if="!book.notes.length">
        <p class="text-gray" v-if="!notesLoading">You don't have any notes for this book yet. Click "Add a Note" above to add one.</p>
        <div class="loading loading-lg" v-show="notesLoading"></div>
      </div>

      <div class="form-horizontal p-0 mb-4" v-if="book.notes.length && tags.length">
        <div class="form-group">
          <div class="col-2 col-sm-12">
            <label for="tag-filter" class="form-label">Filter by Tag</label>
          </div>
          <div class="col-10 col-sm-12">
            <select name="tag-filter" class="form-select" v-model="tagFilter">
              <option value="all">Show All</option>
              <option :value="tag.content" v-for="(tag, index) in tags" :key="index">{{tag.content}}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="note mb-4" v-for="(note, index) in book.notes" :key="index" v-if="showNote(note)">
        <div class="tools mb-5">
          <div class="tags">
            <span class="edit-tag" v-if="note.editTag">
              <span class="chip">
                <i class="avatar avatar-sm icon icon-check" :class="{'c-hand': note.editTag.content && note.editTag.content.length, 'bg-dark': !note.editTag.content || !note.editTag.content.length, 'bg-primary': note.editTag.content && note.editTag.content.length}" @click.prevent="saveTag(note)"></i>
                <input type="text" :ref="`edittag${note.id}`" @input="tagLookup" v-model="note.editTag.content">
                <a href="#" class="btn btn-clear" aria-label="Close" role="button" @click.prevent="cancelTag(note)"></a>
              </span>
            </span>
            <span class="chip" v-for="(tag, index) in note.tags" :key="index">
              {{tag.content}}
              <a href="#" class="btn btn-clear" aria-label="Close" role="button" @click.prevent="deleteTag(note, tag)"></a>
            </span>
            <a href="#" class="ml-1" @click.prevent="addTag(note)" v-if="!note.editTag">Add a Tag</a>
          </div>

          <span class="flex"></span>

          <div class="btn-group">
            <button class="btn btn-primary btn-action mr-2" @click.prevent="edit(note)">
              <i class="icon icon-edit"></i>
            </button>
            <button class="btn btn-primary btn-action" @click.prevent="setDeleteNote(note)">
              <i class="icon icon-delete"></i>
            </button>
          </div>
        </div>

        <div class="lookup-tags mb-5" v-if="note.editTag && note.editTag.lookupTags.length">
          <span class="mr-1">Add an existing tag:</span>
          <span class="chip bg-primary text-light c-hand" v-for="(tag, index) in note.editTag.lookupTags" :key="index" @click.prevent="addLookupTag(note, tag)">
            {{tag.content}}
          </span>
        </div>

        <div class="content" v-html="note.content"></div>
      </div>
    </main>

    <div class="modal modal-sm" :class="{active: confirmDeleteBook.show}">
      <a href="#close" class="modal-overlay" @click.prevent="confirmDeleteBook.show = false" aria-label="Close"></a>
      <div class="modal-container">
        <div class="modal-header">
          <a href="#close" class="btn btn-clear float-right" @click.prevent="confirmDeleteBook.show = false" aria-label="Close"></a>
          <div class="modal-title h5">Confirm Delete</div>
        </div>
        <div class="modal-body">
          <div class="content">
            Are you sure you want do delete this book and all of its notes?
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary mr-2" @click.prevent="deleteBook(book.id)">Confirm</button>
          <button class="btn btn-link" @click.prevent="confirmDeleteBook.show = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- confirm delete book modal -->
    <div class="modal modal-sm" :class="{active: confirmDeleteBook.show}">
      <a href="#close" class="modal-overlay" @click.prevent="confirmDeleteBook.show = false" aria-label="Close"></a>
      <div class="modal-container">
        <div class="modal-header">
          <a href="#close" class="btn btn-clear float-right" @click.prevent="confirmDeleteBook.show = false" aria-label="Close"></a>
          <div class="modal-title h5">Confirmation</div>
        </div>
        <div class="modal-body">
          <div class="content">
            Are you sure you want do delete this book and all the notes it contains?
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-error mr-2" @click.prevent="deleteBook(book.id)">Confirm</button>
          <button class="btn btn-link" @click.prevent="confirmDeleteBook.show = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- confirm delete note modal -->
    <div class="modal modal-sm" :class="{active: confirmDeleteNote.show}">
      <a href="#close" class="modal-overlay" @click.prevent="confirmDeleteNote.show = false" aria-label="Close"></a>
      <div class="modal-container">
        <div class="modal-header">
          <a href="#close" class="btn btn-clear float-right" @click.prevent="confirmDeleteNote.show = false" aria-label="Close"></a>
          <div class="modal-title h5">Confirmation</div>
        </div>
        <div class="modal-body">
          <div class="content">
            Are you sure you want do delete this note?
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary mr-2" @click.prevent="deleteNote()">Confirm</button>
          <button class="btn btn-link" @click.prevent="confirmDeleteNote.show = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderBy } from 'lodash'

export default {
  name: 'Book',
  data() {
    return {
      tab: 'notes',
      book: {notes: []},
      editNote: null,
      notesLoading: false,
      tags: [],
      tagFilter: 'all',
      confirmDeleteBook: {
        show: false
      },
      confirmDeleteNote: {
        show: false
      }
    }
  },
  methods: {
    setTab(tab) {
      this.tab = tab
      this.editNote = {}
    },
    edit(note) {
      this.editNote = {...note, edit: true}
      this.tab = 'addNote'
    },
    showNote(note) {
      if (this.tagFilter === 'all') {
        return true
      }

      return note.tags.filter(t => t.content === this.tagFilter).length
    },
    tagLookup() {
      this.$forceUpdate()
    },
    addTag(note) {
      note.editTag = {lookupTags: [...this.tags.filter(t => !note.tags.find(nt => nt.content === t.content))]}
      this.$forceUpdate()
      setTimeout(() => this.$refs[`edittag${note.id}`][0].focus(), 500)
    },
    addLookupTag(note, tag) {
      note.editTag.content = tag.content
      this.$forceUpdate()
      this.saveTag(note)
    },
    async saveTag(note) {
      try {
        const tag = {...note.editTag, noteId: note.id}
        this.cancelTag(note)

        const response = await fetch(`http://localhost:3001/tag`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tag)
        })
        const newTag = await response.json()
        
        note.tags.push(newTag)
        this.generateTags()
      } catch(e) {
        console.log(e)
      }
    },
    async deleteTag(note, tag) {
      try {
        const response = await fetch(`http://localhost:3001/tag?id=${tag.id}`, {
          method: 'DELETE'
        })
        const deletedId = await response.json()

        note.tags.splice(note.tags.indexOf(note.tags.find(t => t.id === deletedId)), 1)
        this.generateTags()
      } catch(e) {
        console.log(e)
      }
    },
    cancelTag(note) {
      note.editTag = null
      this.$forceUpdate()
    },
    async saveNote() {
      try {
        this.notesLoading = true
        const note = {...this.editNote, bookId: this.book.bookId}

        if (note.edit) {
          const patchResponse = await fetch(`http://localhost:3001/note`, {
            method: 'PATCH',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
          })
          const patchedNote = await patchResponse.json()

          this.book.notes[this.book.notes.indexOf(this.book.notes.find(n => n.id === patchedNote.id))] = patchedNote
          this.$forceUpdate()
        } else {
          const postResponse = await fetch(`http://localhost:3001/note`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
          })
          const newNote = await postResponse.json()

          this.book.notes.push(newNote)
        }

        this.setTab('notes')
      } catch(e) {
        console.log(e)
      } finally {
        this.notesLoading = false
      }
    },
    setDeleteNote(note) {
      this.confirmDeleteNote = {
        show: true,
        note
      }
    },
    async deleteNote() {
      try {
        const response = await fetch(`http://localhost:3001/note?id=${this.confirmDeleteNote.note.id}`, {
          method: 'DELETE'
        })
        const deletedId = await response.json()

        this.book.notes.splice(this.book.notes.indexOf(this.book.notes.find(n => n.id === deletedId)), 1)
        this.confirmDeleteNote.show = false
      } catch(e) {
        console.log(e)
      }
    },
    generateTags() {
      this.tags = this.book.notes.reduce((prev, curr) => {
        const next = [...prev]
        curr.tags.forEach(tag => {
          if (!next.find(t => t.content === tag.content)) {
            next.push(tag)
          }
        })
        return next
      }, [])
    },
    async deleteBook(id) {
      try {
        await fetch (`http://localhost:3001/book?id=${id}`, {
          method: 'DELETE'
        })

        this.$router.push({name: 'library'})
      } catch(e) {
        console.log(e)
      }
    },
  },
  async beforeMount() {
    this.notesLoading = true

    try {
      const response = await fetch(`http://localhost:3001/book?bookId=${this.$route.params.id}`)
      this.book = await response.json()
      this.book.notes = orderBy(this.book.notes, note => new Date(note.createdAt))
      this.generateTags()
    } catch(e) {
      console.log(e)
    } finally {
      this.notesLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;

  .breadcrumb-item:last-child {
    display: flex;
    flex: 1;
  }
}

.edit-note {
  .editr {
    margin-bottom: 0.4rem;
    border-radius: 0.1rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }
}

.note {
  padding: 1rem;
  border: 1px solid #e7e9ed;
  border-radius: 0.1rem;

  .tools, .tags {
    display: flex;

    > *:not(:last-child) {
      margin-right: 0.4rem;
    }
  }

  .tags {
    align-items: center;

    .chip input {
      height: 24px;
      background: transparent;
      border: none;
      color: inherit;
    }
  }

  .lookup-tags {
    display: flex;
    align-items: baseline;
    margin-top: -0.6rem;
  }
}
</style>
