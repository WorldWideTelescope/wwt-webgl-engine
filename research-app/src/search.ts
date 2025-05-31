import { Place } from "@wwtelescope/engine";


export interface SearchDataProvider {
  closestLocation(location: { raDeg: number; decDeg: number; }): Promise<Place | null>;
}
