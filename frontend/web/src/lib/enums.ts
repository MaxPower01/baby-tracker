export enum StoreReducerName {
  App = "appReducer",
  Entries = "entriesReducer",
}

export enum LocalStorageKey {
  AppState = "appState",
  EntriesState = "entriesState",
}

/**
 * Reference:
 *
 * - [Breakpoints - MUI](https://mui.com/customization/breakpoints/)
 *
 * Default values:
 *
 * - xs, extra-small: 0px
 * - sm, small: 600px
 * - md, medium: 900px
 * - lg, large: 1200px
 * - xl, extra-large: 1536px
 */
export enum CSSBreakpoint {
  ExtraSmall = "xs",
  Small = "sm",
  Medium = "md",
  Large = "lg",
  ExtraLarge = "xl",
}

export enum AnchorPosition {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

export enum ActivityType {
  Bath = 0,
  BottleFeeding = 1,
  BreastFeeding = 2,
  Cry = 3,
  Diaper = 4,
  HospitalVisit = 6,
  Medicine = 7,
  MilkExtraction = 8,
  Play = 9,
  Poop = 10,
  Size = 11,
  Sleep = 12,
  SolidFood = 13,
  Temperature = 14,
  Teeth = 15,
  Urine = 16,
  Vaccine = 17,
  Walk = 18,
  Weight = 19,
  Regurgitation = 20,
  Vomit = 21,
  Burp = 22,
}

export enum PageName {
  Home = "home",
  Graphics = "graphics",
  Calendar = "calendar",
  Menu = "menu",
  Entry = "entry",
  Authentication = "authentication",
}
