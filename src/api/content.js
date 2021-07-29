import request from "/src/utils/request";

// 获取文章内容
export function getText(params) {
  return request({
    url: "get_text",
    method: "get",
    params,
  });
}
