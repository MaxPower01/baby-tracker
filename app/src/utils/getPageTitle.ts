import PageName from "@/common/enums/PageName";
import { getPageName } from "./utils";

export default function getPageTitle(pathname: string) {
  const pageName = getPageName(pathname);
  switch (pageName) {
    case PageName.Home:
      return "Accueil";
    case PageName.Graphics:
      return "Graphiques";
    case PageName.Entries:
      return "Entrées";
    case PageName.Entry:
      const entryId = pathname.substring(1).split("/")[1];
      if (entryId) {
        return "Modifier une entrée";
      }
      return "Ajouter une entrée";
    case PageName.Authentication:
      return "Connexion";
    case PageName.Children:
      return "Enfants";
      case PageName.Settings:
        return "Paramètres";
    default:
      return "";
  }
}
