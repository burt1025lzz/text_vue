import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hotLabelList: [],
    randomLabelList: [],
    labelSearchData: "",
    labelSearchList: [],
    titleSearchData: "",
    titleSearchList: [],
    titleSearchCurrentPage: 1,
    labelSearchCurrentPage: 1,
  },
  mutations: {
    getHotList(state, data) {
      state.hotLabelList = data;
    },
    getRandomList(state, data) {
      state.randomLabelList = data;
    },
    getTitleSearchData(state, data) {
      state.titleSearchData = data;
    },
    getLabelSearchData(state, data) {
      state.labelSearchData = data;
    },
    getTitleSearchList(state, data) {
      state.titleSearchList = data;
    },
    getLabelSearchList(state, data) {
      state.labelSearchList = data;
    },
    getTitleSearchCurrentPage(state, data) {
      state.titleSearchCurrentPage = data;
    },
    getLabelSearchCurrentPage(state, data) {
      state.labelSearchCurrentPage = data;
    },
  },
  actions: {},
  modules: {},
});
