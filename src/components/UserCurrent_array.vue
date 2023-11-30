<template>
  <div class="data-box">
    <table v-if="dataArray && dataArray.length > 0">
      <thead>
        <tr>
          <th>Role Name</th>
          <th>Show Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataArray" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.showName }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      No data available.
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCurrent",
  data() {
    return {
      dataArray: [], // To store the array of objects received from the API response
    };
  },
  mounted() {
    // Make the HTTP request to get the JSON response
    this.$http.get("/user/current").then((res) => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        // Parse the JSON data and assign it to the dataArray
        this.dataArray = JSON.parse(data);
      } else {
        this.dataArray = []; // Set dataArray to an empty array if there is an error
        console.error(msg); // Log the error message if the response code is not 0
      }
    });
  },
};
</script>

<style scoped>
.data-box {
  padding: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
