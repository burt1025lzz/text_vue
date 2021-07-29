import request from "/src/utils/request";

// 获取热门标签
export function searchHotLabel(params) {
  return request({
    url: "search_hot_label",
    method: "get",
    params,
  });
}

// 获取随机标签
export function searchRandomLabel() {
  return request({
    url: "search_random_label",
    method: "get",
  });
}
