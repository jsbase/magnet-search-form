<template>
    <section>
        <h1>magnet search</h1>

        <form
            class="mb-3"
            method="POST"
            action="/magnets"
            @submit.prevent="onSubmit"
        >
            <div v-if="error" class="alert alert-dismissible alert-warning">
                <button type="button" class="close">close</button>
                <h4 class="alert-heading">Error!</h4>
                <p v-if="error" class="mb-0">{{ error }}</p>
            </div>
            <div class="form-group">
                <label for="query">Search</label>
                <input
                    v-model="fetchedData.query"
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
                    v-model="fetchedData.category"
                    id="category"
                    class="form-control"
                    type="text"
                    placeholder="e.g. Movies, Apps, All"
                />
            </div>
            <div class="form-group">
                <label for="limit">Limit</label>
                <input
                    v-model="fetchedData.limit"
                    id="limit"
                    class="form-control"
                    type="number"
                    placeholder="e.g. 10, 50, 100"
                />
            </div>
            <button type="submit" class="btn btn-primary">Search</button>
        </form>
        <ul v-for="magnet in fetchedData" :key="magnet.title">
            <li>
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
//const URL = `${process.env.HOST}:${process.env.PORT}/${process.env.API}`;
const URL = 'http://localhost:3000';

const schema = {
    query: '',
    category: '',
    limit: 3,
};

const getUrlParams = (form) => {
    const urlParams = new URLSearchParams();

    for (const pair of new FormData(form)) {
        urlParams.append(pair[0], pair[1]);
    }

    return JSON.stringify(urlParams);
};

const requestMagnets = async (url, opts) => {
    const response = await fetch(url, opts);
    const result = await response.json();

    return JSON.stringify(result);
};

// computed: { log() { return console.log(`computed: ${URL}`); } },
export default {
    name: 'SearchForm',
    data: () => ({
        fetchedData: [],
        formData: schema,
        showForm: true,
        error: '',
    }),
    mounted() {
        const headers = { 'content-type': 'application/json' };

        const magnets = requestMagnets(`${URL}/get`, {
            method: 'GET',
            headers,
            query: getUrlParams(event.target),
        });

        console.log('magnets: ', magnets);

        this.fetchedData.push(magnets);
    },
    methods: {
        onSubmit: async (event) => {
            this.formData = new FormData(event.target);

            const headers = {
                'content-type': 'application/x-www-form-urlencoded',
            };

            const magnets = requestMagnets(`${URL}/post`, {
                headers,
                method: 'POST',
                params: this.formData,
                body: this.formData,
            });

            console.log('magnets: ', magnets);

            this.fetchedData.push(magnets);
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
}

li {
    margin-top: 1rem;
    border: 1px solid #d1d1d1;
}
</style>
