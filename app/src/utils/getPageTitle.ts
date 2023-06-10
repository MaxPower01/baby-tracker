import PageId from "@/common/enums/PageId";
import { getPageName } from "./utils";

export default function getPageTitle(pathname: string) {
  const pageName = getPageName(pathname);
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
    case PageId.Children:
      return "Enfants";
    case PageId.Settings:
      return "Paramètres";
    case PageId.ActivitiesOrder:
      return "Ordre des activités";
    default:
      return "";
  }
}
