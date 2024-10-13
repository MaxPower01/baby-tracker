import { PageId } from "@/enums/PageId";
import { PageLayout } from "@/components/PageLayout";
import React from "react";
import getPageTitle from "@/utils/getPageTitle";

export function TagsPage() {
  return (
    <PageLayout
      topBarProps={{
        pageTitle: getPageTitle({ pageId: PageId.Tags }),
        renderBackButton: true,
      }}
    >
      TagsPage
    </PageLayout>
  );
}
