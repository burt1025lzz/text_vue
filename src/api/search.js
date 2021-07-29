import request from "/src/utils/request";

// 根据文章标题搜索
export function searchTitle(params) {
  return request({
    url: "search_title",
    method: "get",
    params,
  });
}
// 根据文章标签搜索
export function searchLabel(params) {
  return request({
    url: "search_label",
    method: "get",
    params,
  });
}
