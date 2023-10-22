import { PageId } from "@/enums/PageId";

export default function getPath({
  page,
  id,
  params,
}: {
  page: PageId;
  id?: string | number;
  params?: Record<string, string>;
}) {
  let path = "";
  if (Object.values(PageId).includes(page)) {
    path = `/${page}`;
  }
  if (typeof id !== "undefined") {
    path += `/${id}`;
  }
  if (params) {
    path += `?${new URLSearchParams(params).toString()}`;
  }
  return path;
}
