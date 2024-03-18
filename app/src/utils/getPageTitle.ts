import { PageId } from "@/enums/PageId";
import getPageId from "@/utils/getPageId";

export default function getPageTitle(pathname: string) {
  const pageName = getPageId(pathname);
  switch (pageName) {
    case PageId.Home:
      return "Accueil";
    case PageId.Graphics:
      return "Graphiques";
    case PageId.Entries:
      return "Entrées";
    case PageId.Entry:
      const entryId = pathname.substring(1).split("/")[1];
      if (entryId) {
        return "Modifier une entrée";
      }
      return "Ajouter une entrée";
    case PageId.Authentication:
      return "Connexion";
    case PageId.Family:
      return "Ma famille";
    case PageId.Settings:
      return "Paramètres";
    case PageId.EntryTypes:
      return "Activités";
    case PageId.Child:
      const childId = pathname.substring(1).split("/")[1];
      if (childId) {
        return "Modifier un enfant";
      }
      return "Ajouter un enfant";
    default:
      return "";
  }
}
