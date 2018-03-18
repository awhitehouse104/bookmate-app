<template>
  <div id="book">
    <ul class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/library">My Library</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link :to="{name: 'book', params: {id: book.bookId}}">{{book.title}}</router-link>
      </li>
    </ul>

    <ul class="tab tab-block mb-5">
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
        <button class="btn btn-primary" @click.prevent="saveNote()">Save Note</button>
      </div>
    </section>

    <main v-show="tab === 'notes'">
      <div class="empty-state" v-if="!book.notes.length">
        <p class="text-gray" v-if="!notesLoading">You don't have any notes for this book yet. Click "Add a Note" above to add one.</p>
        <div class="loading loading-lg" v-show="notesLoading"></div>
      </div>

      <div class="form-horizontal mb-2" v-if="book.notes.length && tags.length">
        <div class="form-group">
          <div class="col-2 col-sm-12">
            <label for="tag-filter" class="form-label">Filter by Tag</label>
          </div>
          <div class="col-10 col-sm-12">
            <select name="tag-filter" class="form-select" v-model="tagFilter">
              <option value="all">All</option>
              <option :value="tag.content" v-for="(tag, index) in tags" :key="index">{{tag.content}}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="note mb-4" v-for="(note, index) in book.notes" :key="index" v-if="showNote(note)">
        <div class="tools">
          <div class="btn-group">
            <button class="btn btn-link" @click.prevent="addTag(note)">Add a Tag</button>
            <button class="btn btn-link" @click.prevent="edit(note)">Edit</button>
            <button class="btn btn-link" @click.prevent="deleteNote(note)">Delete</button>
          </div>
        </div>

        <div class="tags mb-5">
          <span class="edit-tag" v-if="note.editTag">
            <span class="chip">
              <i class="avatar avatar-sm icon icon-check bg-dark" :class="{'c-hand': note.editTag.content && note.editTag.content.length, 'bg-success': note.editTag.content && note.editTag.content.length}" @click.prevent="saveTag(note)"></i>
              <input type="text" :ref="`edittag${note.id}`" @input="tagLookup" v-model="note.editTag.content">
              <a href="#" class="btn btn-clear" aria-label="Close" role="button" @click.prevent="cancelTag(note)"></a>
            </span>
            <div class="lookup-tags mt-2" v-if="note.editTag.lookupTags.length">
              <span>Add an existing tag:</span>
              <span class="chip c-hand" v-for="(tag, index) in note.editTag.lookupTags" :key="index" @click.prevent="addLookupTag(note, tag)">
                {{tag.content}}
              </span>
            </div>
          </span>

          <span class="chip" v-for="(tag, index) in note.tags" :key="index">
            {{tag.content}}
            <a href="#" class="btn btn-clear" aria-label="Close" role="button" @click.prevent="deleteTag(note, tag)"></a>
          </span>
        </div>

        <div class="content" v-html="note.content"></div>
      </div>
    </main>
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
      tagFilter: 'all'
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
    async deleteNote(note) {
      try {
        const response = await fetch(`http://localhost:3001/note?id=${note.id}`, {
          method: 'DELETE'
        })
        const deletedId = await response.json()

        this.book.notes.splice(this.book.notes.indexOf(this.book.notes.find(n => n.id === deletedId)), 1)
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
    }
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
.edit-note {
  .editr {
    margin-bottom: 0.4rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }
}

.note {
  padding: 0.75rem 1rem 1rem 1rem;
  border: 1px solid #e7e9ed;

  .tools, .tags {
    display: flex;

    > *:not(:last-child) {
      margin-right: 0.4rem;
    }
  }

  .tools {
    justify-content: end;
  }

  .tags {
    .chip input {
      height: 24px;
      background: transparent;
      border: none;
      color: inherit;
    }
  }
}
</style>
