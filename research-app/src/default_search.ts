import { distance } from "@wwtelescope/astro";
import { Constellations, Imageset, Place, URLHelpers, URLRewriteMode } from "@wwtelescope/engine";
import { BandPass, Classification, ImageSetType, ProjectionType, SolarSystemObjects } from "@wwtelescope/engine-types";

import { SearchDataProvider } from "./search";

const H2R = Math.PI / 12;
const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const D2H = 1 / 15;

interface SearchImageset {
  bd: number;
  cX: number;
  cY: number;
  ct: string;
  cu: string;
  n: string;
  oX?: number;
  oY?: number;
  r?: number;
  tu: string;
  u: string;
  wf?: number;
  lv?: number;
  bp?: number;
  bl?: number;
  pr?: number;
  ft?: string;
  bu?: boolean;
  q?: string;
  ds?: boolean;
}

interface SearchPlace {
  d: number;
  n: string;
  r: number;
  z?: number;
  c?: number;
  fgi?: SearchImageset; 
}

interface SearchConstellationInfo {
  name: string;
  places: SearchPlace[];
}

interface SearchData {
  Constellations: SearchConstellationInfo[];
}

function rewriteURLs(item: Place | Imageset) {
  const thumbURL = item.get_thumbnailUrl();
  if (thumbURL) {
    item.set_thumbnailUrl(URLHelpers.singleton.rewrite(thumbURL, URLRewriteMode.AsIfAbsolute));
  }

  const url = item.get_url();
  if (url) {
    item.set_url(URLHelpers.singleton.rewrite(url, URLRewriteMode.AsIfAbsolute));
  }
}

function createPlace(searchPlace: SearchPlace, constellation: string): Place {
  const place = new Place();
  place.set_names([searchPlace.n]);
  place.set_dec(searchPlace.d);
  place.set_RA(searchPlace.r);
  const classification: Classification = searchPlace.c != null ? searchPlace.c : Classification.unidentified;
  place.set_classification(classification);
  place.set_constellation(constellation);
  place.set_type(ImageSetType.sky);
  const zoom = searchPlace.z != null ? searchPlace.z : -1;
  place.set_zoomLevel(zoom);
  return place;
}

function createImageset(searchImageset: SearchImageset, id: number): Imageset {
  const bandPass = (searchImageset.bp !== undefined) ? searchImageset.bp : BandPass.visible;
  const projection = (searchImageset.pr !== undefined) ? searchImageset.pr : ProjectionType.tan;
  const baseTileLevel = (searchImageset.bl !== undefined) ? searchImageset.bl : 0;
  const fileType = (searchImageset.ft !== undefined) ? searchImageset.ft : ".png";
  const tileLevels = (searchImageset.lv !== undefined) ? searchImageset.lv : 4;
  const bottomsUp = (searchImageset.bu !== undefined) ? searchImageset.bu : false;
  const quadTreeMap = (searchImageset.q !== undefined) ? searchImageset.q : "";
  const offsetX = (searchImageset.oX !== undefined) ? searchImageset.oX : 0;
  const offsetY = (searchImageset.oY !== undefined) ? searchImageset.oY : 0;
  const defaultSet = (searchImageset.ds !== undefined) ? searchImageset.ds : false; // "StockSet" in XML
  const rotation = (searchImageset.r !== undefined) ? searchImageset.r : 0;
  const widthFactor = (searchImageset.wf !== undefined) ? searchImageset.wf : 2;

  const imageset = new Imageset();
  imageset.set_name(searchImageset.n);
  imageset.set_url(searchImageset.u);
  imageset.set_thumbnailUrl(searchImageset.tu);
  imageset.set_creditsText(searchImageset.ct);
  imageset.set_creditsUrl(searchImageset.cu);
  imageset.set_centerX(searchImageset.cX);
  imageset.set_centerY(searchImageset.cY);
  imageset.set_baseTileDegrees(searchImageset.bd);

  imageset.set_dataSetType(ImageSetType.sky);
  imageset.set_bandPass(bandPass);
  imageset.set_projection(projection);
  imageset.set_baseLevel(baseTileLevel);
  imageset.set_extension(fileType);
  imageset.set_levels(tileLevels);
  imageset.set_bottomsUp(bottomsUp);
  imageset.set_quadTreeTileMap(quadTreeMap);
  imageset.set_offsetX(offsetX);
  imageset.set_offsetY(offsetY);
  imageset.set_defaultSet(defaultSet);
  imageset.set_rotation(rotation);
  imageset.set_widthFactor(widthFactor);

  imageset.set_sparse(true);
  imageset.set_elevationModel(false);
  imageset.set_demUrl("");
  imageset.set_altUrl("");
  imageset.set_referenceFrame("");
  imageset.set_meanRadius(0);
  imageset.set_baseTileDegrees(-1);
  
  return imageset;
}

export class DefaultSearchDataProvider implements SearchDataProvider {
  static _dataUrl = "https://web.wwtassets.org/data/searchdata_v2.min.js";
  static _prefix = "wwt.searchData=";

  _data: Record<string, Place[]> = {};
  _dataLoaded = false;

  async loadDataIfNeeded(): Promise<void> {
    if (!this._dataLoaded) {
      return this.fetchData().then(searchData => {
        this._data = this.parseData(searchData);
        this._dataLoaded = true;
      });
    }
    return Promise.resolve();
  }

  async fetchData(): Promise<SearchData> {
    return fetch(DefaultSearchDataProvider._dataUrl)
      .then(res => res.text())
      .then(text => {
        const prunedText = text.slice(DefaultSearchDataProvider._prefix.length);
        const js = `const x=${prunedText}; x`;
        return eval(js);
      });
  }

  parseData(data: SearchData): Record<string, Place[]> {
    let imagesetID = 100;
    const places: Record<string, Place[]> = {};
    data.Constellations.forEach(info => {
      const constellation = info.name;
      const constellationPlaces: Place[] = [];
      info.places.forEach(searchPlace => {
        const place = createPlace(searchPlace, constellation);

        const imagesetInfo = searchPlace.fgi;
        imagesetID += 1;
        if (imagesetInfo) {
          const imageset = createImageset(imagesetInfo, imagesetID);
          place.set_studyImageset(imageset);
          rewriteURLs(imageset);
        }

        if (constellation === "SolarSystem") {
          place.set_target(SolarSystemObjects.undefined);
        }
        rewriteURLs(place);

        constellationPlaces.push(place);
      });

      places[constellation] = constellationPlaces;
    });

    return places;
  }

  async placeForLocation(location: { raDeg: number; decDeg: number; }): Promise<Place | null> {
    await this.loadDataIfNeeded();
    const constellation = Constellations.containment.findConstellationForPoint(location.raDeg * D2H, location.decDeg);

    let constellationPlaces: Place[] = [];
    const ssPlaces: Place[] = this._data["SolarSystem"];
    for (const con in this._data) {
      if (con === constellation) {
        constellationPlaces = this._data[constellation];
      }
    }

    const searchPlaces = ssPlaces.concat(constellationPlaces);
    let closestDist: number | null = null;
    let closestPlace: Place | null = null;
    searchPlaces.forEach(place => {
      try {
        const dist = distance(place.get_RA() * H2R, place.get_dec() * D2R, location.raDeg * D2R, location.decDeg * D2R);
        if ((!isNaN(dist)) && ((closestDist === null) || (dist < closestDist))) {
          closestPlace = place;
          closestDist = dist;
        }
      } catch (error) {
        if (place && place.get_name() !== "Earth") {
          console.warn(error);
        }
      }
    });

    return closestPlace;
  }
}
