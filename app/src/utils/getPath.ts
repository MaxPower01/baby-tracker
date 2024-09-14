import { PageId } from "@/enums/PageId";

export default function getPath({
  page,
  paths,
  params,
}: {
  page: PageId;
  paths?: string[];
  params?: Record<string, string>;
}) {
  let path = "";
  if (Object.values(PageId).includes(page)) {
    path = `/${page}`;
  }
  if (typeof paths !== "undefined") {
    if (Array.isArray(paths) && paths.length > 0) {
      path += `/${paths.join("/")}`;
    } else {
      path += `/${paths}`;
    }
  }
  if (params) {
    path += `?${new URLSearchParams(params).toString()}`;
  }
  return path;
}
