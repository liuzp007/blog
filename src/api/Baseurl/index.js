import { post } from "../../utils/axios_instans";

//
export function getImageOssBaseurl(data) {
  return post("/api/gongyong/api/v1/address/type", data);
}
