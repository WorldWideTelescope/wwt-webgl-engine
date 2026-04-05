// Copyright 2020-2021 the .NET Foundation
// Licensed under the MIT License

import { defineStore } from 'pinia';

import { ImagesetInfo, SpreadSheetLayerInfo } from '@wwtelescope/engine-pinia';
import { ImageSetType } from '@wwtelescope/engine-types';

export interface BaseSource {
  name: string;
  catalogLayer: CatalogLayerInfo;
  zoomDeg?: number;
  layerData: {
    [field: string]: string | undefined;
  };
  type: ImageSetType; 
}

export interface SkySource extends BaseSource {
  ra: number;
  dec: number;
}

export interface LngLatSource extends BaseSource {
  lng: number;
  lat: number;
}

export type Source = SkySource | LngLatSource;

// This union type includes ImagesetInfo as an option to include HiPS catalogs
// which combine elements of both Imageset and Spreadsheet layers
export type CatalogLayerInfo = SpreadSheetLayerInfo | ImagesetInfo;

export interface TableLayerStatus {
  visible: boolean;
  type: 'hips' | 'table';
  layer: CatalogLayerInfo;
  selectable: boolean;
}

type EquivalenceTest<T> = (t1: T, t2: T) => boolean;

function getIndex<T>(array: T[], item: T, equivalent: EquivalenceTest<T> | null = null): number {
  if (!equivalent) {
    return array.indexOf(item);
  }
  for (const [index, value] of array.entries()) {
    if (equivalent(item, value)) {
      return index;
    }
  }
  return -1;
}

function addToArrayWithoutDuplication<T>(array: T[], item: T, equivalent: EquivalenceTest<T> | null = null): boolean {
  const index = getIndex(array, item, equivalent);
  if (index < 0) {
    array.push(item);
    return true;
  }
  return false;
}

function removeFromArray<T>(array: T[], item: T, equivalent: EquivalenceTest<T> | null = null): number {
  const index = getIndex(array, item, equivalent);
  if (index >= 0) {
    array.splice(index, 1);
  }
  return index;
}

function infoKey(info: CatalogLayerInfo) {
  return info.id ?? "";
}

function sourcesEqual(s1: Source, s2: Source) {
  const lng1 = "lng" in s1 ? s1.lng : s1.ra;
  const lng2 = "lng" in s2 ? s2.lng : s2.ra;
  const lat1 = "lat" in s1 ? s1.lat : s1.dec;
  const lat2 = "lat" in s2 ? s2.lat : s2.dec;
  return (lng1 === lng2) &&
         (lat1 === lat2) &&
         (infoKey(s1.catalogLayer) === infoKey(s2.catalogLayer));
}

function getFilteredLayers(statusMap: { [id: string]: TableLayerStatus | undefined },
                           filter: (status: TableLayerStatus) => boolean): CatalogLayerInfo[] {
  const statuses = Object.values(statusMap);
  const filtered: CatalogLayerInfo[] = [];
  for (const status of statuses) {
    if (status !== undefined && filter(status)) {
      filtered.push(status.layer);
    }
  }
  return filtered;
}

interface WWTResearchAppPiniaState {
  _tableLayers: { [id: string]: TableLayerStatus | undefined };
  catalogNameMappings: { [catalogName: string]: [string, string] };
  sources: Source[];
}

export const researchAppStore = defineStore('wwt-research-app', {
  
  state: (): WWTResearchAppPiniaState => ({
    _tableLayers: {},
    catalogNameMappings: {
      "2MASS All-Sky Catalog of Point Sources (Cutri+ 2003)": ["2MASS", "2MASS"],
      "The Guide Star Catalog, Version 2.3.2 (GSC2.3) (STScI, 2006)": ["GSC23", "GSC 2.3"],
      "The PPMXL Catalog (Roeser+ 2010)": ["PPMXL_ID", "PPMXL"],
      "UCAC5 Catalogue (Zacharias+ 2017) (ucac5)": ["SrcIDgaia", "GAIA ID"],
      "Gaia DR2 (Gaia Collaboration, 2018) (gaia2)": ["source_id", "GAIA ID"],
      "The SDSS Photometric Catalogue, Release 12 (Alam+, 2015) (sdss12)": ["SDSS12", "SDSS12"],
      "The Pan-STARRS release 1 (PS1) Survey - DR1 (Chambers+, 2016) (ps1)": ["f_objID", "PAN-Starrs ID"],
    },
    sources: []
  }),
  
  getters: {

    hipsCatalogs(state) {
      return () => getFilteredLayers(state._tableLayers, status => status.type == 'hips');
    },

    visibleHipsCatalogs(state) {
      return () => getFilteredLayers(state._tableLayers, status => status.type == 'hips' && status.visible);
    },

    tableLayers(state) {
      return () => getFilteredLayers(state._tableLayers, _status => true);
    },

    visibleTableLayers(state) {
      return () => getFilteredLayers(state._tableLayers, status => status.visible);
    },

    selectableTableLayers(state) {
      return () => getFilteredLayers(state._tableLayers, status => status.visible && status.selectable);
    },

    researchAppTableLayerVisibility(state) {
      return (info: CatalogLayerInfo) => {
        const status = state._tableLayers[infoKey(info)];
        if (status == undefined) {
          return false;
        }
        return status.visible;
      }
    },

    researchAppTableLayerSelectability(state) {
      return (info: CatalogLayerInfo) => {
        const status = state._tableLayers[infoKey(info)];
        if (status == undefined) {
          return false;
        }
        return status.selectable;
      }
    }
  },

  actions: {
    addResearchAppTableLayer(info: CatalogLayerInfo) {
      const status: TableLayerStatus = {
        type: info instanceof ImagesetInfo ? 'hips' : 'table',
        visible: true,
        layer: info,
        selectable: true
      };
      this._tableLayers[infoKey(info)] = status;
    },

    removeResearchAppTableLayer(layer: CatalogLayerInfo) {
      delete this._tableLayers[infoKey(layer)];
    },

    setResearchAppTableLayerVisibility(args: { layer: CatalogLayerInfo; visible: boolean }) {
      const status = this._tableLayers[infoKey(args.layer)];
      if (status !== undefined) {
        status.visible = args.visible;
      }
    },

    setResearchAppTableLayerSelectability(args: { layer: CatalogLayerInfo; selectable: boolean }) {
      const status = this._tableLayers[infoKey(args.layer)];
      if (status !== undefined) {
        status.selectable = args.selectable;
      }
    },

    addSource(source: Source) {
      addToArrayWithoutDuplication(this.sources, source, sourcesEqual);
    },

    removeSource(source: Source) {
      removeFromArray(this.sources, source);
    }

  }
  
});
