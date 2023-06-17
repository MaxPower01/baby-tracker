import PageId from "@/common/enums/PageId";

export default function getPageName(pathname: string): PageId {
  let page = pathname.substring(1).split("/")[0];
  if (page === "") {
    page = PageId.Home;
  }
  if (Object.values(PageId).includes(page as PageId)) {
    return page as PageId;
  }
  return PageId.Home;
}
