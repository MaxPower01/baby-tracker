import { PageId } from "@/enums/PageId";
import getPageId from "@/utils/getPageId";

export default function getPageTitle(props: {
  pathname?: string;
  pageId?: PageId;
}) {
  if (props.pageId == null && props.pathname != null) {
    props.pageId = getPageId(props.pathname);
  }

  if (props.pageId == null) {
    return "";
  }

  switch (props.pageId) {
    case PageId.Home:
      return "Accueil";
    case PageId.Charts:
      return "Graphiques";
    case PageId.History:
      return "Historique";
    case PageId.Entry:
      try {
        const entryId = props.pathname?.substring(1).split("/")[1];
        if (entryId) {
          return "Modifier une entrée";
        }
        return "Ajouter une entrée";
      } catch (error) {
        return "Ajouter une entrée";
      }
    case PageId.Family:
      return "Ma famille";
    case PageId.Settings:
      return "Paramètres";
    case PageId.Activities:
      return "Activités";
    case PageId.Baby:
      try {
        const babyId = props.pathname?.substring(1).split("/")[1];
        if (babyId) {
          return "Modifier un enfant";
        }
        return "Ajouter un enfant";
      } catch (error) {
        return "Ajouter un enfant";
      }
    default:
      return "";
  }
}
