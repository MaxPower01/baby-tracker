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
  Bath,
  BottleFeeding,
  BreastFeeding,
  Cry,
  Diaper,
  HeadCircumference,
  HospitalVisit,
  Medicine,
  MilkExtraction,
  Play,
  Poop,
  Size,
  Sleep,
  SolidFood,
  Temperature,
  Teeth,
  Urine,
  Vaccine,
  Walk,
  Weight,
}

export enum PageName {
  Home = "home",
  Stats = "stats",
  Calendar = "calendar",
  Settings = "settings",
  Entry = "entry",
}
