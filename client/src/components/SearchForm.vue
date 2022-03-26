<template>
  <section>
    <h1>magnet search</h1>
    <form class="mb-3" v-on:submit.prevent="onSubmit">
      <div class="form-group">
        <label for="query">Search</label>
        <input
          v-model.trim="formValue.query"
          id="query"
          class="form-control"
          type="text"
          placeholder="What are you looking for?"
          name="query"
          required
        />
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <input
          v-model.trim="formValue.category"
          id="category"
          class="form-control"
          type="text"
          name="category"
          placeholder="e.g. Movies, Apps, All"
        />
      </div>
      <div class="form-group">
        <label for="limit">Limit</label>
        <input
          v-model.number="formValue.limit"
          id="limit"
          class="form-control"
          type="number"
          name="limit"
          placeholder="e.g. 10, 50, 100"
        />
      </div>
      <button type="submit" class="pure-button pure-button-primary">
        Search
      </button>
    </form>
    <ul>
      <li v-for="(torrent, idx) in torrents" :key="idx">
        <h4 v-if="torrent.title" class="mt-0 mb-1">
          <strong>{{ idx }}.)</strong>
          {{ torrent.title }}
        </h4>
        <p v-if="torrent.seeds" class="mt-0 mb-1">
          <span>Seeds:</span>
          {{ torrent.seeds }}
        </p>
        <p v-if="torrent.peers" class="mt-0 mb-1">
          <span>Peers:</span>
          {{ torrent.peers }}
        </p>
        <p>
          <span>{{ torrent.provider }}</span>
          <span>Link:</span>
          <a :href="torrent.desc">{{ torrent.desc }}</a>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "SearchForm",
  data: () => ({
    URL: "http://localhost:3000/magnets",
    HEADERS: {
      json: {"Content-Type": "application/json; charset=UTF-8"},
      text: {"Content-Type": "text/plain; charset=UTF-8"}
    },
    formValue: {
      query: "",
      category: "All",
      limit: 1
    },
    torrents: []
  }),
  computed: {
    log() {
      return console.table(this.torrents);
    }
  },
  mounted() {},
  methods: {
    onSubmit: async () => {
      console.table(this.formValue);

      const data = await this.fetch(this.URL, {
        method: "POST",
        headers: this.HEADERS.json,
        body: JSON.stringify(this.formValue)
      });
      const torrents = await data.json();

      this.torrents.push(torrents);
      console.table(this.torrents);

      return this.torrents;
    }
  }
};
</script>

<style scoped>
h1 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 4em;
  text-decoration: none;
}
ul {
  list-style-type: none;
  list-style-position: outside;
  margin: 1rem auto;
  width: 80%;
}
li {
  margin-top: 1rem;
  border: 1px solid #d1d1d1;
}
.pure-button-primary {
  background-color: tomato;
  border: 1px solid red;
  border-radius: 5px;
  color: #fff;
  font-weight: 700;
  padding: 8px 12px;
  margin: 15px auto 0;
  text-align: center;
  width: 100%;
}
.pure-button-primary:active,
.pure-button-primary:focus,
.pure-button-primary:hover {
  background-color: red;
}
</style>
