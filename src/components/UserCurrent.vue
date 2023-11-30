<template>
  <div class="data-box">
    <pre>{{ responseData }}</pre>
  </div>
</template>

<script>
export default {
  name: "UserCurrent",
  data() {
    return {
      responseData: "", // To store the HTTP response data
    };
  },
  mounted() {
    // Make the HTTP request to get the plain text response
    this.$http.get("/user/current").then((res) => {
      this.responseData = JSON.stringify(res.data, null, 2); // Convert JSON response to plain text
    });
  },
};
</script>

<style scoped>
.data-box {
  padding: 16px;
}
</style>
