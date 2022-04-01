<template>
  <section>
    <div id="poster"></div>
    <div id="layout">
      <h1>magnet search</h1>
      <form class="pure-form pure-form-stacked" v-on:submit.prevent="submit">
        <fieldset class="pure-control-group">
          <label for="query">Search</label>
          <input
            v-model="formValue.query"
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
            v-model="formValue.category"
            id="category"
            class="form-control"
            type="text"
            name="category"
            placeholder="e.g. Movies, Apps, All"
          />

          <label for="limit">Limit</label>
          <input
            v-model="formValue.limit"
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
        <li v-for="torrent in torrents" :key="torrent.id">
          <h4 class="mt-0 mb-1">
            {{ torrent.title }}
          </h4>
          <p class="mt-0 mb-1">
            <span>Seeds:</span>
            {{ torrent.seeds }}
          </p>
          <p class="mt-0 mb-1">
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
    </div>
  </section>
</template>

<script>
export default {
  name: "SearchForm",

  /* computed: {
    log: function () {
      return console.table(this.torrents);
    }
    //url: `${this.protocol}://${this.host}:${this.port}${this.torrentsApi}
  },
  */

  data() {
    return {
      url: "http://localhost:3000/torrents",
      formValue: {
        query: "1080p",
        category: "Movies",
        limit: 2
      },
      torrents: [],
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          Origin: "http://localhost:8080",
          Referer: "http://localhost:3000/torrents"
        }
      }
    };

    //error: null,
    //Referer: "http://localhost:3000/torrents",
    //Connection: "Keep-Alive",
    //"Keep-Alive": "timeout=12, max=1000",
    //"Cache-Control": "no-cache"
  },

  /*
    created() {
    const options = Object.assign(
      {
        body: JSON.stringify(this.formValue)
      },
      this.options
    );

    const result = this.load(this.url, options);
    //alert(`url: ${this.url} \n options: ${JSON.stringify(options)}`);

    result
      .then(function (torrents) {
        // console.log("torr: ", torr);
        //alert(`torrents: ${JSON.stringify(torrents)}`);
        this.torrents = this.torrents.concat(torrents);
      })
      .catch(function (error) {
        this.error = error;
        //alert(`error: ${typeof error === "string" ? error : JSON.stringify(error)}`);
        console.error("Error: ", error);
      });
    },
    */
  methods: {
    async load(url, opts) {
      alert(`LOAD   url: ${url}   this.load: ${JSON.stringify(opts)}`);
      alert(`LOAD   url: ${url}   this.load: ${JSON.stringify(opts)}`);
      const response = await fetch(url, opts);
      const data = await response.json();
      const json = JSON.stringify(data);
      alert(`LOAD   json: ${json}`);
      const result = JSON.parse(json);
      //this.torrents = result.slice(0, -1);
      //await this.$nextTick();
      /*
        this.$nextTick(() => {});
        */
      //this.$forceUpdate();
      alert(`LOAD   result: ${json}`);
      return result;
    },

    submit(e) {
      e.preventDefault();

      /* alert(
          `submit \n url: ${this.url} \n formValue: ${JSON.stringify(
            this.formValue
          )}`
        ); */
      // console.log(`\n formValue: ${JSON.stringify(this.formValue)}`);

      const options = Object.assign(
        {
          body: JSON.stringify(this.formValue)
        },
        this.options
      );

      this.torrents.length = 0;
      // this.error = null;

      // console.log(`opts: ${JSON.stringify(opts)}`);
      //alert(`options: : ${JSON.stringify(options)}`);
      const result = this.load(this.url, options);
      this.$forceUpdate();
      this.torrents = result.slice(0, -1);
      this.$forceUpdate();
      alert(`SUBMIT   this.torrents: ${JSON.stringify(this.torrents)}`);
      /*
        result
        .then(function (torrents) {
          alert(`torrents [${typeof torrents}]: ${JSON.stringify(torrents)}`);
          //this.torrents = this.torrents.concat(torrents);

          alert(
            `this.torrents [${typeof this.torrents}]: ${JSON.stringify(
              this.torrents
            )}`
          );

          this.torrents = [...torrents];

          Promise.resolve(this.torrents);

          return false;
        })
        .catch(function (error) {
          this.error = error.toString();
          alert(`Error: ${this.error}`);
          console.error("Error: ", this.error);
        });
        */

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
  margin: 2rem 1rem;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: stretch;
}
li {
  margin-top: 1rem;
  border: 1px solid #d1d1d1;
}
.pure-button-primary {
  background-color: tomato;
  border: 1px solid tomato;
  border-radius: 5px;
  color: #fff;
  font-weight: 700;
  padding: 0.3rem;
  margin: 1rem 0;
  text-align: center;
  width: 100%;
}
.pure-button-primary:active,
.pure-button-primary:focus,
.pure-button-primary:hover {
  background-color: red;
}
</style>
