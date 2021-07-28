<template>
  <div class="container">
    <div class="title-container">
      <el-row type="flex" justify="space-between">
        <el-col style="padding-left: 10px" :span="6">
          <div>
            <el-button
              icon="el-icon-back"
              type="info"
              @click="handleBack"
              circle
            ></el-button>
          </div>
        </el-col>
        <el-col :span="12" class="title">
          <span>《 {{ title }} 》</span>
        </el-col>
        <el-col :span="6">
          <div style="float: right; padding-right: 10px">
            <el-button
              v-show="type"
              type="primary"
              @click="handleOpenMenu"
              size="medium"
            >
              文章目录
            </el-button>
            <el-button
              type="primary"
              @click="handleChangeType"
              size="medium"
              v-text="type ? '全文模式' : '分页模式'"
            >
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </div>
    <div
      v-if="!loading"
      :class="type ? 'content-container-all' : 'content-container'"
    >
      <div v-for="(item, index) in content" :key="index">
        <div :ref="'page' + index">
          <el-row v-if="type" type="flex" class="title" justify="center">
            <el-col class="content-cell" :span="20">
              <el-divider class="content-divider" content-position="center">
                第 {{ index + 1 }} 页
              </el-divider>
            </el-col>
          </el-row>
        </div>
        <template v-if="item">
          <div v-for="(text, idx) in contentCell(item)" :key="idx">
            <el-row type="flex" class="title" justify="center">
              <el-col class="content-cell" :span="20" v-html="text"></el-col>
            </el-row>
          </div>
        </template>
        <template v-else>
          <el-row type="flex" class="title" justify="center">
            <el-col
              style="text-align: center"
              class="content-cell"
              :span="20"
              v-html="'此页无数据'"
            ></el-col>
          </el-row>
        </template>
      </div>
    </div>
    <div v-else v-loading="loading" style="height: 90vh; z-index: 2"></div>
    <div v-if="!type" class="bottom-container">
      <el-divider></el-divider>
      <el-row type="flex" class="title" justify="center">
        <el-col :span="2">
          <el-button
            :disabled="leftBtn"
            icon="el-icon-caret-left"
            size="small"
            type="primary"
            plain
            @click="handleChangePage(false)"
          ></el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            :disabled="rightBtn"
            icon="el-icon-caret-right"
            size="small"
            type="primary"
            plain
            @click="handleChangePage(true)"
          ></el-button>
        </el-col>
      </el-row>
      <el-row type="flex" class="bottom-btn" justify="center">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="1"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleSearch"
        >
        </el-pagination>
      </el-row>
    </div>
    <el-drawer
      size="150"
      title="目录列表"
      :visible.sync="drawer"
      direction="rtl"
    >
      <el-tree
        :data="menu"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-drawer>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Content",
  computed: {
    contentCell() {
      return function (item) {
        return item.split("\n");
      };
    },
  },
  watch: {
    currentPage(data) {
      if (data === 1) {
        this.leftBtn = true;
      } else if (data === this.total) {
        this.rightBtn = true;
      } else {
        this.leftBtn = false;
        this.rightBtn = false;
      }
    },
  },
  data() {
    return {
      drawer: false,
      loading: true,
      title: "",
      code: null,
      currentPage: 1,
      total: null,
      content: [],
      type: true,
      menu: [],
      leftBtn: true,
      rightBtn: false,
      defaultProps: {
        id: 0,
        label: "label",
        children: "children",
      },
    };
  },
  methods: {
    handleChangeType() {
      this.type = !this.type;
      this.handleSearch();
    },
    handleBack() {
      this.$router.back();
    },
    handleOpenMenu() {
      this.drawer = true;
    },
    handleSearch() {
      this.loading = true;
      const params = {
        title: this.title,
        page: this.code,
      };
      if (!this.type) {
        params.startPage = this.currentPage;
        params.endPage = this.currentPage;
      }
      axios
        .get("http://127.0.0.1:5000/get_text", {
          params: params,
        })
        .then((resp) => {
          this.loading = false;
          this.content = resp.data;
        });
    },
    handleChangePage(type) {
      if (type) {
        if (this.currentPage < this.total) {
          this.currentPage++;
        }
      } else {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      }
      this.handleSearch();
    },
    handleGetPages() {
      axios
        .get("http://127.0.0.1:5000/search_title", {
          params: {
            title: this.title,
          },
        })
        .then((resp) => {
          const arr = resp.data.sort((a, b) => b.pages - a.pages);
          this.code = arr[0].page;
          this.total = arr[0].pages;
          for (let i = 1; i <= this.total; i++) {
            this.menu.push({
              id: i,
              label: `第 ${i} 页`,
            });
          }
          this.handleSearch();
        });
    },
    handleNodeClick(row) {
      this.$refs["page" + String(row.id - 1)][0].scrollIntoView();
    },
  },
  created() {
    this.title = this.$route.params.title;
    this.handleGetPages();
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

.title-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 5px 0;
  z-index: 3;
}

.title {
  font-size: 25px;
  font-weight: bolder;
  color: #606266;
  text-align: center;
}

.content-container {
  margin: 61px 0 102px 0;
}

.content-container-all {
  margin: 0 0 102px 0;
}

.content-cell {
  text-align: left;
  font-size: 16px;
  font-weight: normal;
  line-height: 40px;
}

.content-divider {
  margin: 90px 0 30px 0 !important;
}

.bottom-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 5px 0;
  z-index: 3;
}

.bottom-btn {
  text-align: center;
  margin: 5px 0;
}

/deep/ .el-divider--horizontal {
  margin: 5px 0;
}

/deep/ .el-tree-node__content {
  justify-content: center;
}

/deep/ .el-tree-node__expand-icon.is-leaf {
  display: none;
}

/deep/ .el-drawer__body {
  margin-bottom: 80px;
}
</style>
