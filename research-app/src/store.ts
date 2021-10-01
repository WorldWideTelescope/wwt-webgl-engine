// Copyright 2020-2021 the .NET Foundation
// Licensed under the MIT License

import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ImagesetInfo, SpreadSheetLayerInfo } from '@wwtelescope/engine-vuex';
import Vue from 'vue';

export interface Source {
  ra: number;
  dec: number;
  name: string;
  layer: LayerInfo;
  zoomDeg?: number;
  layerData: {
    [field: string]: string | undefined;
  };
}

export type LayerInfo = SpreadSheetLayerInfo | ImagesetInfo;

export interface TableLayerStatus {
  visible: boolean;
  type: 'hips' | 'table';
  layer: LayerInfo;
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

function infoKey(info: LayerInfo) {
  return info instanceof ImagesetInfo ? info.name : info.id;
}

function sourcesEqual(s1: Source, s2: Source) {
  return (s1.ra === s2.ra) && (s1.dec === s2.dec) && (infoKey(s1.layer) === infoKey(s2.layer));
}

function getFilteredLayers(statusMap: { [id: string]: TableLayerStatus | undefined },
                           filter: (status: TableLayerStatus) => boolean): LayerInfo[] {
  const statuses = Object.values(statusMap);
  const filtered: LayerInfo[] = [];
  for (const status of statuses) {
    if (status !== undefined && filter(status)) {
      filtered.push(status.layer);
    }
  }
  return filtered;
}

@Module({
  namespaced: true,
  stateFactory: true,
})
export class WWTResearchAppModule extends VuexModule {
  
  _tableLayers: { [id: string]: TableLayerStatus | undefined } = {};
  sources: Source[] = [];

  catalogNameMappings: { [catalogName: string]: [string, string] } = {
    "2MASS All-Sky Catalog of Point Sources (Cutri+ 2003)": ["2MASS", "2MASS"],
    "The Guide Star Catalog, Version 2.3.2 (GSC2.3) (STScI, 2006)": ["GSC23", "GSC 2.3"],
    "The PPMXL Catalog (Roeser+ 2010)": ["PPMXL_ID", "PPMXL"],
    "UCAC5 Catalogue (Zacharias+ 2017) (ucac5)": ["SrcIDgaia", "GAIA ID"],
    "Gaia DR2 (Gaia Collaboration, 2018) (gaia2)": ["source_id", "GAIA ID"],
    "The SDSS Photometric Catalogue, Release 12 (Alam+, 2015) (sdss12)": ["SDSS12", "SDSS12"],
    "The Pan-STARRS release 1 (PS1) Survey - DR1 (Chambers+, 2016) (ps1)": ["f_objID", "PAN-Starrs ID"],
  }

  get hipsCatalogs() {
    return () => getFilteredLayers(this._tableLayers, status => status.type == 'hips');
  }

  get visibleHipsCatalogs() {
    return () => getFilteredLayers(this._tableLayers, status => status.type == 'hips' && status.visible);
  }

  get tableLayers() {
    return () => getFilteredLayers(this._tableLayers, _status => true);
  }

  get visibleTableLayers() {
    return () => getFilteredLayers(this._tableLayers, status => status.visible);
  }

  get researchAppTableLayerVisibility() {
    return (info: LayerInfo) => {
      const status = this._tableLayers[infoKey(info)];
      if (status == undefined) {
        return false;
      }
      return status.visible;
    }
  }

  @Mutation
  addResearchAppTableLayer(info: LayerInfo) {
    const status: TableLayerStatus = {
      type: info instanceof ImagesetInfo ? 'hips' : 'table',
      visible: true,
      layer: info,
    };
    Vue.set(this._tableLayers, infoKey(info), status);
  }

  @Mutation
  removeResearchAppTableLayer(layer: LayerInfo) {
    Vue.delete(this._tableLayers, infoKey(layer));
  }

  @Mutation
  setResearchAppTableLayerVisibility(args: { layer: LayerInfo; visible: boolean }) {
    const status = this._tableLayers[infoKey(args.layer)];
    if (status !== undefined) {
      Vue.set(status, 'visible', args.visible);
    }
  }

  @Mutation
  addSource(source: Source) {
    addToArrayWithoutDuplication(this.sources, source, sourcesEqual);
  }

  @Mutation
  removeSource(source: Source) {
    removeFromArray(this.sources, source);
  }
}
