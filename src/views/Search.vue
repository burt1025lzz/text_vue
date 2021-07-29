<template>
  <div class="container">
    <el-row class="top" type="flex" justify="center">
      <router-link to="/">
        <el-button type="info" icon="el-icon-back" circle></el-button>
      </router-link>
      <el-button
        @click="handleChangeType"
        type="success"
        icon="el-icon-refresh"
        class="changeType"
        circle
      ></el-button>
      <span class="title">{{ type }}</span>
      <el-col class="input" :span="6">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </el-col>
      <el-button
        @click="handleSearch(true)"
        type="primary"
        icon="el-icon-search"
        circle
      ></el-button>
    </el-row>
    <el-row class="table" type="flex" justify="center">
      <el-col :span="14">
        <el-table :data="tableData" height="529" border style="width: 100%">
          <el-table-column prop="title" label="文章标题" min-width="400">
            <template slot-scope="scope">
              <span class="tableItem" @click="handleGoText(scope.row)">{{
                scope.row.title
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pages" label="页数" width="230" />
        </el-table>
      </el-col>
    </el-row>
    <el-row class="pagination" type="flex" justify="center">
      <el-col :span="10">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { searchTitle, searchLabel } from "/src/api/search";
export default {
  name: "Search",
  data() {
    return {
      input: "",
      type: "",
      tableData: [],
      tableAllData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    handleGoText(row) {
      if (this.type === "文 章 搜 索") {
        this.$store.commit("getTitleSearchCurrentPage", this.currentPage);
      } else {
        this.$store.commit("getLabelSearchCurrentPage", this.currentPage);
      }
      this.$router.push({
        name: "Content",
        params: {
          title: row.title,
          page: row.page,
          pages: row.pages,
        },
      });
    },
    handleChangeType() {
      this.$router.push({
        name: "Search",
        params: {
          type: this.$route.params.type === "label" ? "title" : "label",
        },
      });
      this.type =
        this.$route.params.type === "label" ? "标 签 搜 索" : "文 章 搜 索";
      this.tableData = [];
      this.input = "";
    },
    handleSearch(type) {
      if (this.type === "文 章 搜 索") {
        if (type) {
          this.$store.commit("getTitleSearchList", []);
          this.$store.commit("getTitleSearchData", "");
        }
        if (this.$store.state.titleSearchList.length === 0) {
          searchTitle({
            title: this.input,
          }).then((resp) => {
            this.tableAllData = resp;
            this.total = this.tableAllData.length;
            this.currentPage = 1;
            this.tableData = this.pages(
              this.tableAllData,
              this.pageSize,
              this.currentPage - 1
            );
            this.$store.commit("getTitleSearchList", this.tableAllData);
          });
          this.$store.commit("getTitleSearchData", this.input);
        } else {
          this.tableAllData = this.$store.state.titleSearchList;
          this.total = this.tableAllData.length;
          this.currentPage = this.$store.state.titleSearchCurrentPage;
          this.tableData = this.pages(
            this.tableAllData,
            this.pageSize,
            this.currentPage - 1
          );
        }
      } else {
        if (type) {
          this.$store.commit("getLabelSearchList", []);
          this.$store.commit("getLabelSearchData", "");
        }
        if (this.$store.state.labelSearchList.length === 0) {
          searchLabel({
            label: this.input,
          }).then((resp) => {
            this.tableAllData = resp;
            this.total = this.tableAllData.length;
            this.currentPage = 1;
            this.tableData = this.pages(
              this.tableAllData,
              this.pageSize,
              this.currentPage - 1
            );
            this.$store.commit("getLabelSearchList", this.tableAllData);
          });
          this.$store.commit("getLabelSearchData", this.input);
        } else {
          this.tableAllData = this.$store.state.labelSearchList;
          this.total = this.tableAllData.length;
          this.currentPage = this.$store.state.labelSearchCurrentPage;
          this.tableData = this.pages(
            this.tableAllData,
            this.pageSize,
            this.currentPage - 1
          );
        }
        this.total = this.tableAllData.length;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableData = this.pages(this.tableAllData, val, this.currentPage - 1);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableData = this.pages(this.tableAllData, this.pageSize, val - 1);
    },
    pages(listData, sizePage, currentPage) {
      const pages = [];
      listData.forEach((item, index) => {
        sizePage >= listData.length && (sizePage = listData.length);
        const page = Math.floor(index / sizePage);
        !pages[page] && (pages[page] = []);
        pages[page].push(item);
      });
      return pages[currentPage];
    },
  },
  created() {
    if (this.$route.params.type === "label") {
      this.type = "标 签 搜 索";
      if (this.$store.state.labelSearchData) {
        this.input = this.$store.state.labelSearchData;
      }
    } else {
      this.type = "文 章 搜 索";
      if (this.$store.state.titleSearchData) {
        this.input = this.$store.state.titleSearchData;
      }
    }
    this.$route.params.data && (this.input = this.$route.params.data);
    if (this.$route.params.state) {
      this.handleSearch(true);
    } else {
      this.handleSearch(false);
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
}

.top {
  margin: 20px 0;
}

.changeType {
  margin: 8px 20px !important;
}

.title {
  font-size: 40px;
  font-weight: bolder;
  color: #606266;
}

.input {
  margin: 0 20px;
  display: flex;
  align-items: center;
}

.table {
  margin: 20px 0;
}

.table /deep/ .cell {
  text-align: center;
}

.tableItem {
  cursor: pointer;
}

.tableItem:hover {
  color: #409eff;
}

.pagination {
  text-align: center;
}

/deep/ .el-button.is-circle {
  margin: 8px 0;
}
</style>
