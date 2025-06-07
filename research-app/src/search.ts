import { Place } from "@wwtelescope/engine";


export interface SearchDataProvider {
  placeForLocation(location: { raDeg: number; decDeg: number; }): Promise<Place | null>;
}
