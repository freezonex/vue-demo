<template>
  <div>
    <div class="data-box">
      <el-table :data="dataList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="220">
        </el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" width="220">
        </el-table-column>
        <el-table-column prop="accountType" label="账户类型" width="140px">
        </el-table-column>
        <el-table-column prop="personCode" label="人员编号"> </el-table-column>
        <el-table-column prop="personName" label="人员名称"> </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page.sync="form.pageIndex"
          :page-size="form.pageSize"
          :total="form.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserList",
  data() {
    return {
      form: {
        pageIndex: 1,
        pageSize: 5,
        keyword: null,
        total:0
      },
      dataList: [],
      loading: false,
    };
  },
  watch: {
    "form.pageIndex"() {
      this.getDataList();
    },
  },
  methods: {
    getDataList() {
      this.loading = true;
      
      this.$http.get("/user/list", { params: this.form }).then((res) => {
        debugger;
        const { code, message, list, pagination } = res.data;
        if (code !== 0) return this.$message.error(message);
        if (list) {
          this.dataList = list;
          this.form.total = pagination.total;
        }
        setTimeout(() => {
          this.loading = false;
        }, 800);
      });
    },
  },
  mounted() {
    console.log("获取数据");
    this.getDataList();
  },
};
</script>

<style scoped>
.search-box {
  padding-top: 14px;
  border-bottom: 1px solid #ebeef5;
}
.data-box {
  padding: 16px;
}
.page-box {
  padding-top: 10px;
  text-align: right;
}
</style>