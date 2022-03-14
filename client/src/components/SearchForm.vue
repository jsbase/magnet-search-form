<template>
    <section>
        <h1>magnet search</h1>

        <form @submit.prevent="onSubmit" class="mb-3">
            <div v-if="error" class="alert alert-dismissible alert-warning">
                <button type="button" class="close">close</button>
                <h4 class="alert-heading">Error!</h4>
                <p class="mb-0">{{ error }}</p>
            </div>
            <div class="form-group">
                <label for="query">Search</label>
                <input
                    id="query"
                    v-model="fetchedData.title"
                    type="text"
                    class="form-control"
                    placeholder="What are you looking for?"
                    required
                />
            </div>
            <div class="form-group">
                <label for="subject">Category</label>
                <input
                    id="category"
                    v-model="fetchedData.category"
                    type="text"
                    class="form-control"
                    placeholder="e.g. Movies, Apps, All"
                />
            </div>
            <div class="form-group">
                <label for="limit">Results to show</label>
                <input
                    v-model="fetchedData.limit"
                    type="number"
                    class="form-control"
                    id="limit"
                    placeholder="e.g. 10, 50, 100"
                />
            </div>
            <button type="submit" class="btn btn-primary">Search</button>
        </form>

        <ul v-for="item in fetchedData" :key="item.time">
            <li>
                <h4 v-if="item.title" class="mt-0 mb-1">{{ item.title }}</h4>
                <p v-if="item.seeds" class="mt-0 mb-1">
                    Seeds: {{ item.seeds }}
                </p>
                <p v-if="item.peers" class="mt-0 mb-1">
                    Peers: {{ item.peers }}
                </p>
                <br />Tracker Link:
                <a :href="item.desc">{{ item.desc }}</a>
            </li>
        </ul>
    </section>
</template>

<script>
//const URL = `${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_TORRENT_PATH}`;
const URL = 'http://localhost:3000/torrents';

const schema = {
    query: 'free',
    category: 'all',
    limit: 25,
};

const getRequestBody = (form) => {
    const requestBody = new URLSearchParams();

    for (const pair of new FormData(form)) {
        requestBody.append(pair[0], pair[1]);
    }

    return JSON.stringify(requestBody);
};

export default {
    name: 'SearchForm',
    data: () => ({
        fetchedData: [],
        formData: schema,
        error: '',
        showForm: true,
    }),
    computed: {
        log() {
            return console.log(`computed: ${URL}`);
        },
    },
    mounted() {
        fetch(URL)
            .then((response) => response.json())
            .then((result) => {
                this.fetchedData = result;
            });
    },
    methods: {
        onSubmit(event) {
            console.log('onSubmit: ', event);

            const body = getRequestBody(event.target);
            const headers = { 'content-type': 'application/json' };

            console.log('body: ', body);

            fetch(URL, { method: 'POST', body, headers })
                .then((response) => response.json())
                .then((result) => {
                    console.log('result: ', result);

                    this.error = '';

                    this.showForm = false;

                    this.fetchedData.push(result);
                })
                .catch((err) => {
                    this.error = `Error: ${err}`;
                    console.err(this.error);
                });
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
</style>
