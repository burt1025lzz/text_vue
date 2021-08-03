<template>
  <div class="container">
    <el-row type="flex" class="title" justify="center">爬 虫 汇 总</el-row>
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <el-input
          ref="input"
          :placeholder="server ? '请输入内容' : ''"
          v-model="input"
          class="input"
          :disabled="!server"
        >
          <el-select v-model="select" slot="prepend" class="input__select">
            <el-option label="文章搜索" value="title"></el-option>
            <el-option label="标签搜索" value="label"></el-option>
          </el-select>
          <el-button
            :disabled="!server"
            slot="append"
            icon="el-icon-search"
            @click="handleSearch"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-row v-if="server" type="flex" justify="center">
      <el-col :span="15" class="label-title"> 热门标签：</el-col>
    </el-row>
    <el-row v-if="server" type="flex" justify="center">
      <el-col v-show="!hotLabelListLoading" class="label" :span="16">
        <template v-for="(item, index) in hotList">
          <el-badge :key="index" :value="item.len" :type="btnColor(index)">
            <el-tag :type="btnColor(index)" @click="handleSearch(item.type)">
              {{ item.type }}
            </el-tag>
          </el-badge>
        </template>
      </el-col>
      <el-col v-show="hotLabelListLoading" class="label" :span="16">
        加载中...
      </el-col>
    </el-row>
    <el-row v-if="server" type="flex" class="randomLabel" justify="center">
      <el-col :span="15" class="label-title">
        随机标签：
        <el-button
          @click="handleGetRandomLabel(true)"
          icon="el-icon-refresh"
          circle
        ></el-button>
      </el-col>
    </el-row>
    <el-row v-if="server" type="flex" justify="center">
      <el-col v-show="!randomLabelListLoading" class="label" :span="16">
        <template v-for="(item, index) in randomList">
          <el-badge :key="index" :value="item.len" :type="btnColor(index)">
            <el-tag :type="btnColor(index)" @click="handleSearch(item.type)">
              {{ item.type }}
            </el-tag>
          </el-badge>
        </template>
      </el-col>
      <el-col v-show="randomLabelListLoading" class="label" :span="16">
        加载中...
      </el-col>
    </el-row>
    <el-row v-if="!server" type="flex" justify="center">
      后台服务未启动!
    </el-row>
  </div>
</template>

<script>
import { searchHotLabel, searchRandomLabel, testServer } from "../api";

export default {
  name: "Home",
  data() {
    return {
      input: "",
      select: "title",
      hotList: [],
      randomList: [],
      server: null,
      hotLabelListLoading: null,
      randomLabelListLoading: null,
    };
  },
  computed: {
    btnColor() {
      return function (index) {
        index++;
        if (index % 4 === 0) {
          return "success";
        } else if (index % 3 === 0) {
          return "info";
        } else if (index % 2 === 0) {
          return "warning";
        } else {
          return "danger";
        }
      };
    },
  },
  methods: {
    handleSearch(value) {
      const type = typeof value === "string" ? "label" : this.select;
      const data = typeof value === "string" ? value : this.input;
      this.$router.push({
        name: "Search",
        params: {
          type: type,
          data: data,
          state: true,
        },
      });
    },
    handleGetRandomLabel(type) {
      if (this.$store.state.randomLabelList.length === 0 || type) {
        this.randomLabelListLoading = true;
        searchRandomLabel().then((resp) => {
          this.randomLabelListLoading = false;
          this.randomList = resp.map((item) => {
            return {
              type: item.type,
              len: item.len,
            };
          });
          this.$store.commit("getRandomList", this.randomList);
        });
      } else {
        this.randomList = this.$store.state.randomLabelList;
      }
    },
    handleGetHotLabel() {
      if (this.$store.state.hotLabelList.length === 0) {
        this.hotLabelListLoading = true;
        searchHotLabel({
          startNum: 1,
          endNum: 10,
        }).then((resp) => {
          this.hotLabelListLoading = false;
          this.hotList = resp.map((item) => {
            return {
              type: item.type,
              len: item.len,
            };
          });
          this.$store.commit("getHotList", this.hotList);
        });
      } else {
        this.hotList = this.$store.state.hotLabelList;
      }
    },
  },
  created() {
    testServer()
      .then((resp) => {
        if (resp) {
          this.server = true;
          this.handleGetHotLabel();
          this.handleGetRandomLabel(false);
        }
      })
      .catch(() => {
        this.server = false;
      });
  },
};
</script>
<style scoped>
.container {
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  color: #606266;
}

.title {
  font-size: 40px;
  font-weight: bolder;
}

.input {
  text-align: center;
  margin: 40px 0;
}

.input__select {
  width: 150px;
}

.label-title {
  font-size: 18px;
  margin: 10px 0;
}

.label {
  margin-top: 10px;
  padding-left: 3px;
  display: flex;
  justify-content: space-evenly;
}

.randomLabel {
  margin-top: 15px;
}

/deep/ .el-tag {
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}

/deep/ .el-button.is-circle {
  padding: 5px;
}
</style>
