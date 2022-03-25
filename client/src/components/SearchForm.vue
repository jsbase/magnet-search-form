<template>
    <section>
        <h1>magnet search</h1>

        <form
            class="mb-3"
            enctype="application/x-www-form-urlencoded; UTF-8"
            v-on:submit="onSubmit"
        >
            <div class="form-group">
                <label for="query">Search</label>
                <input
                    v-model.trim="formValue.query"
                    id="query"
                    class="form-control"
                    type="text"
                    placeholder="What are you looking for?"
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
                    placeholder="e.g. 10, 50, 100"
                />
            </div>
            <button type="submit" class="pure-button pure-button-primary">
                Search
            </button>
        </form>

        <ul>
            <li v-for="(magnet, key) in magnets">
                <h4 v-if="magnet.title" class="mt-0 mb-1">
                    {{ magnet.title }}
                </h4>
                <p v-if="magnet.seeds" class="mt-0 mb-1">
                    <span>Seeds: </span>
                    {{ magnet.seeds }}
                </p>
                <p v-if="magnet.peers" class="mt-0 mb-1">
                    <span>Peers: </span>
                    {{ magnet.peers }}
                </p>
                <p>
                    <span>Tracker Link: </span>
                    <a :href="magnet.desc">{{ magnet.desc }}</a>
                </p>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    name: 'SearchForm',
    data: () => ({
        URL: 'http://localhost:3000/magnets', // `${process.env.HOST}:${process.env.PORT}/${process.env.API}`
        HEADERS: {
            json: { 'Content-Type': 'application/json; charset=UTF-8' },
            text: { 'Content-Type': 'text/plain; charset=UTF-8' },
            encoded: {
                'Content-Type':
                    'application/x-www-form-urlencoded; charset=UTF-8',
            },
        },
        formValue: {
            query: '',
            category: 'All',
            limit: 2,
        },
        magnets: [],
    }),
    computed: {
        log() {
            return console.log(
                `(on computed) fetched magnets from "${this.URL}": `,
                this.magnets
            );
        },
    },
    mounted() {
        /*
        const magnets = this.fetchTorrents(`${this.URL}`, {
            query: getUrlParams(event.target)
        });

        this.magnets.push(magnets);
        */
    },
    methods: {
        getUrlParams: (form) => {
            const urlParams = new URLSearchParams();

            for (const pair of new FormData(form)) {
                urlParams.append(pair[0], pair[1]);
            }

            return JSON.stringify(urlParams);
        },
        fetchTorrents: async (url, opts) => {
            const res = await fetch(url, opts);
            const data = await res.json();

            return JSON.stringify(data);
        },
        onSubmit: (event) => {
            console.log('[onSubmit] formData(event.target):', new FormData(event.target));
            console.log('this.formValue: ', this.formValue);

            // const { query, category, limit } = this.formValue;
            // console.log('query: ', query);
            // console.log('category: ', category);
            // console.log('limit: ', limit);

            this.magnets.push(
                this.fetchTorrents(this.URL, {
                    headers: this.HEADERS.encoded,
                    method: 'POST',
                    body: this.formValue,
                })
            );

            console.log('onSubmit -> this.magnets: ', this.magnets);
        },
    },
};
</script>

<style>
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
    margin-top: 15px auto 0;
    text-align: center;
    width: 86%;
}

.pure-button-primary:active,
.pure-button-primary:focus,
.pure-button-primary:hover {
    background-color: red;
}
</style>
