import { PageId } from "@/enums/PageId";

export default function getPath({
  page,
  ids,
  params,
}: {
  page: PageId;
  ids?: string[];
  params?: Record<string, string>;
}) {
  let path = "";
  if (Object.values(PageId).includes(page)) {
    path = `/${page}`;
  }
  if (typeof ids !== "undefined") {
    if (Array.isArray(ids) && ids.length > 0) {
      path += `/${ids.join("/")}`;
    } else {
      path += `/${ids}`;
    }
  }
  if (params) {
    path += `?${new URLSearchParams(params).toString()}`;
  }
  return path;
}
