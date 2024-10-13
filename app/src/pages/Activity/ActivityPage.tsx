import { PageId } from "@/enums/PageId";
import { PageLayout } from "@/components/PageLayout";
import React from "react";
import getPageTitle from "@/utils/getPageTitle";

export function ActivityPage() {
  return (
    <PageLayout
      topBarProps={{
        pageTitle: getPageTitle({ pageId: PageId.Activities }),
        renderBackButton: true,
      }}
    >
      Activity
    </PageLayout>
  );
}
