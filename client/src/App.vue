<template>
    <SearchForm></SearchForm>
</template>

<script>
import SearchForm from './components/SearchForm.vue';

export default {
    name: 'App',
    components: {
        SearchForm,
    },
};
</script>

<style>
#app {
    font-family: "-apple, Avenir, 'Helvetica-Neue', sans-serif";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background: rgb(75, 19, 38);
    background: linear-gradient(
        150deg,
        rgba(75, 19, 38, 1) 4%,
        rgba(34, 37, 52, 1) 73%
    );
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    justify-content: stretch;
    height: 100vh;
    width: 100vw;
}
</style>
