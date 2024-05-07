import { PageId } from "@/enums/PageId";

export default function getPageId(pathname: string): PageId {
  let pageId = pathname.substring(1).split("/")[0];
  if (pageId === "") {
    pageId = PageId.Home;
  }
  if (Object.values(PageId).includes(pageId as PageId)) {
    return pageId as PageId;
  }
  return PageId.Home;
}
