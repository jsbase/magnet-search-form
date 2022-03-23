<template>
    <section>
        <h1>magnet search</h1>

        <form
            class="mb-3"
            @submit="onSubmit"
            enctype="application/x-www-form-urlencoded; UTF-8"
        >
            <!-- enctype="application/x-www-form-urlencoded; UTF-8" -->
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
                    name="query"
                    class="form-control"
                    type="text"
                    placeholder="What are you looking for?"
                    required
                />
            </div>
            <div class="form-group">
                <label for="category">Category</label>
                <input
                    name="category"
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
                    name="limit"
                    v-model="fetchedData.limit"
                    id="limit"
                    class="form-control"
                    type="number"
                    placeholder="e.g. 10, 50, 100"
                />
            </div>
            <button type="submit" class="btn btn-primary">Search</button>
        </form>
        <ul v-for="magnet in fetchedData" :key="magnet.query">
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
// const URL = `${process.env.HOST}:${process.env.PORT}/${process.env.API}`
const URL = 'http://localhost:3000/magnets';

const HEADER = {
    json: { 'Content-Type': 'application/json; charset=UTF-8' },
    text: { 'Content-Type': 'text/plain; charset=UTF-8' },
    encoded: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
};

const getUrlParams = (form) => {
    const urlParams = new URLSearchParams();

    for (const pair of new FormData(form)) {
        urlParams.append(pair[0], pair[1]);
    }

    return JSON.stringify(urlParams);
};

const requestMagnets = async (url, opts) => {
    const res = await fetch(url, opts);
    const data = await res.json();

    return JSON.stringify(data);
};

export default {
    name: 'SearchForm',
    data: () => ({
        formData: {
            query: '',
            category: 'All',
            limit: 2,
        },
        fetchedData: [],
    }),
    computed: {
        log() {
            return console.log(`(on computed) URL: ${URL}`);
        },
    },
    mounted() {
        alert(`(on mounted) URL: ${URL}`);

        /*
        const magnets = requestMagnets(`${URL}`, {
            query: getUrlParams(event.target)
        });

        console.log('magnets: ', magnets);

        this.fetchedData.push(magnets);
        */
    },
    methods: {
        onSubmit: (event) => {
            this.formData = new FormData(event.target);

            console.log('[onSubmit] target:', event.target);
            console.log(
                '[onSubmit] URL parameter: ',
                getUrlParams(this.formData)
            );

            const magnets = requestMagnets(URL, {
                headers: HEADER.encoded,
                method: 'POST',
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
    margin: 1rem auto;
    width: 80%;
}

li {
    margin-top: 1rem;
    border: 1px solid #d1d1d1;
}

.btn {
    padding: 8px 12px;
    font-weight: 700;
}

.btn-primary {
    background-color: tomato;
    border: 1px solid red;
    border-radius: 5px;
    color: #fff;
    text-align: center;
    width: 80%;

    &:active,
    &:focus,
    &:hover {
        background-color: red;
    }
}
</style>
