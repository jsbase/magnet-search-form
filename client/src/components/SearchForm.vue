<template>
  <div>
    <form @submit.prevent="onSubmit" class="mb-3">
      <div v-if="error" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert">×</button>
        <h4 class="alert-heading">Error!</h4>
        <p class="mb-0">{{error}}</p>
      </div>
      <div class="form-group">
        <label for="term">Search</label>
        <input
          v-model="item.term"
          type="text"
          class="form-control"
          id="term" required>
      </div>
      <div class="form-group">
        <label for="subject">Category</label>
        <input
          v-model="item.category"
          type="text"
          class="form-control"
          id="category"
          placeholder="Enter a category" required>
      </div>
      <div class="form-group">
        <label for="amount">Amount</label>
        <input
          v-model="item.amount"
          type="number"
          class="form-control"
          id="amount"
          placeholder="How many results?">
      </div>
      <button type="submit" class="btn btn-primary">Add Message</button>
    </form>
    <div class="list-unstyled" v-for="item in fetchedData" :key="item._id">
      <li class="media">
        <img v-if="message.imageURL" class="mr-3" :src="message.imageURL" :alt="message.subject">
        <div class="media-body">
          <h4 class="mt-0 mb-1">{{ item.title }}</h4>
          <p class="mt-0 mb-1">Peers: {{ item.peers }}</p>
          <br />
          <a href="{{ item.url }}">{{ item.url }}</a>
        </div>
      </li>
      <hr>
    </div>
  </div>
</template>

<script>
const API_URL = "http://localhost:3000/torrents";

export default {
  name: "SearchForm",
  data: () => ({
    error: "",
    fetchedData: [],
    formData: {
      term: "1080p",
      category: "all",
      amount: 50
    }
  }),
  computed: {
    reversedMessages() {
      return this.fetchedData.slice().reverse();
    }
  },
  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        this.fetchedData = result;
      });
  },
  methods: {
    onSubmit() {
      const fData = new FormData(this.target));
      
      console.log(JSON.stringify(fData));

      fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(fData),
        headers: {
          "content-type": "application/json"
        }
      })
        .then(response => response.json())
        .then(result => {
          if (result.details) {
            // there was an error...
            const error = result.details
              .map(detail => detail.message)
              .join(". ");
            this.error = error;
          } else {
            this.error = "";
            this.showForm = false;
            this.fetchedData.push(result);
          }
        });
    }
  }
};
</script>

<style>
img {
  height: auto;
  max-width: 300px;
}
</style>
