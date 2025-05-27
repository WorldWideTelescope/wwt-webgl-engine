import { Place } from "@wwtelescope/engine";


export interface SearchDataProvider {
  closestLocation(location: { ra: number; dec: number; }): Promise<Place | null>;
}
