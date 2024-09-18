import { BabyWidget } from "@/components/BabyWidget";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntriesList } from "@/components/Entries/EntriesList/EntriesList";
import { EntriesWidget } from "@/pages/Home/components/EntriesWidget";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { bottomBarNewEntryFabId } from "@/utils/constants";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEffect } from "react";
import { useEntries } from "@/components/Entries/EntriesProvider";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const { recentEntries, status } = useEntries();

  // TODO: Subscribe to entries changes only if user is Premium
  useEffect(() => {}, [user?.babyId]);

  const handleEmptyStateClick = () => {
    const targetButton = document.getElementById(bottomBarNewEntryFabId);
    if (targetButton) {
      targetButton.click();
    }
  };

  if (user?.babyId == null || isNullOrWhiteSpace(user?.babyId)) {
    return <LoadingIndicator />;
  }

  return (
    <SectionStack>
      <Section
        onClick={() =>
          navigate(
            getPath({
              page: PageId.Baby,
              paths: [user.babyId],
            })
          )
        }
        sx={{
          position: "relative",
        }}
      >
        <BabyWidget
          sx={{
            zIndex: 1,
          }}
        />
      </Section>
      <Section>
        <EntriesWidget entries={recentEntries} />
      </Section>

      <Section>
        {status === "busy" && recentEntries.length == 0 ? (
          <LoadingIndicator />
        ) : recentEntries.length == 0 ? (
          <EmptyState
            context={EmptyStateContext.Entries}
            onClick={handleEmptyStateClick}
          />
        ) : (
          <EntriesList entries={recentEntries} format="cards" />
        )}
      </Section>
    </SectionStack>
  );
}
