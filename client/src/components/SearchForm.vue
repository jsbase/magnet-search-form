<template>
  <main>
    <section id="poster"></section>
    <section id="layout">
      <h1>magnet search</h1>
      <form class="pure-form pure-form-stacked" v-on:submit.prevent="submit">
        <fieldset class="pure-control-group">
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
        </fieldset>
        <fieldset class="pure-control-group">
          <label for="category">Category</label>
          <input
            v-model.trim="formValue.category"
            id="category"
            class="form-control"
            type="text"
            name="category"
            placeholder="e.g. Movies, Apps, All"
          />

          <label for="limit">Limit</label>
          <input
            v-model.number="formValue.limit"
            id="limit"
            class="form-control"
            type="number"
            name="limit"
            placeholder="e.g. 10, 50, 100"
          />
        </fieldset>
        <button type="submit" class="pure-button pure-button-primary">
          Search
        </button>
      </form>
      <ul>
        <li v-for="(torrent, idx) in torrents" :key="idx">
          <h4 v-if="torrent.title" class="mt-0 mb-1">
            <strong>{{ idx + 1 }}.</strong> {{ torrent.title }}
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
  </main>
</template>

<script>
export default {
  name: "SearchForm",

  computed: {
    log: function () {
      return console.table(this.torrents);
    }
  },

  data: function () {
    return {
      formValue: {
        query: "",
        category: "All",
        limit: 1
      },
      torrents: []
    };
  },

  created: function () {
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: JSON.stringify(this.formValue)
    };
    const torrents = this.load("http://localhost:3000/torrents", opts);

    console.log("created: ", torrents);

    torrents.then((torr) => {
      this.torrents.length = 0;
      this.torrents = this.torrents.concat(torr);
    });
  },

  methods: {
    load: async (url, opts) => {
      const response = await fetch(url, opts);
      const result = await response.json();
      return result.then((data) => {
        Promise.resolve(data);
      });
    },

    submit: function (event) {
      event.preventDefault();

      console.log("this.formValue: ", this.formValue);

      const opts = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: JSON.stringify(this.formValue)
      };

      //console.log(`\n submit \n opts: ${JSON.stringify(opts)} \n`);

      const result = this.load("http://localhost:3000/torrents", opts);
      result.then((torrents) => {
        console.log(`\n torrents: ${JSON.stringify(torrents)} \n`);
        this.torrents.length = 0;
        this.torrents = this.torrents.concat(torrents);
      });

      return false;
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
