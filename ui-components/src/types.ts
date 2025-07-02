import { SearchDataProvider } from "./search";

export interface FinderScopeProps {
  modelValue: boolean;
  searchProvider: SearchDataProvider;
  position: [number, number];
}
