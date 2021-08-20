import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ImagesetInfo } from '@wwtelescope/engine-vuex';
import Vue from 'vue';
export interface Source {
  ra: number;
  dec: number;
  name: string;
  catalogName: string;
  zoomDeg?: number;
  catalogData: {
    [field: string]: string | undefined;
  }
}

export interface HipsCatalogStatus {
  visible: boolean;
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

function sourcesEqual(s1: Source, s2: Source) {
  return (s1.ra === s2.ra) && (s1.dec === s2.dec) && (s1.catalogName === s2.catalogName);
}

// Increment the counter by 1 every time this is called
const newSourceName = (function () {
  let count = 0;

  return function () {
    count += 1;
    return `Source ${count}`;
  };
})();

function nameForSource(catalogData: any, catalogName: string, catalogNameMappings: { [catalogName: string]: [string, string] }): string {
  for (const [key, [from, to]] of Object.entries(catalogNameMappings)) {
    if (from in catalogData && catalogName === key) {
      return `${to}: ${catalogData[from]}`;
    }
  }
  return newSourceName();
}

@Module({
  namespaced: true,
  stateFactory: true,
})
export class WWTResearchAppModule extends VuexModule {

  hipsCatalogs: ImagesetInfo[] = [];
  hipsCatalogVisibilities: boolean[] = [];
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

  get researchAppHipsCatalogVisibility() {
    return (catalog: ImagesetInfo) => {
      const index = getIndex(this.hipsCatalogs, catalog);
      return (index >= 0) ? this.hipsCatalogVisibilities[index] : false;
    }
  }

  get visibleHipsCatalogs() {
    return () => this.hipsCatalogs.filter((_catalog, index) => this.hipsCatalogVisibilities[index]);
  }

  @Mutation
  addResearchAppCatalogHips(catalog: ImagesetInfo) {
    const added = addToArrayWithoutDuplication(this.hipsCatalogs, catalog);
    if (added) {
      this.hipsCatalogVisibilities.push(true);
    }
  }

  @Mutation
  removeResearchAppCatalogHips(catalog: ImagesetInfo) {
    const index = removeFromArray(this.hipsCatalogs, catalog);
    if (index >= 0) {
      this.hipsCatalogVisibilities.splice(index, 1);
    }
  }

  @Mutation
  setResearchAppCatalogHipsVisibility(args: { catalog: ImagesetInfo; visible: boolean }) {
    const index = getIndex(this.hipsCatalogs, args.catalog);
    if (index >= 0) {
      Vue.set(this.hipsCatalogVisibilities, index, args.visible);
    }
  }

  @Mutation
  addSource(source: Source) {
    source.name = nameForSource(source.catalogData, source.catalogName, this.catalogNameMappings);
    addToArrayWithoutDuplication(this.sources, source, sourcesEqual);
  }

  @Mutation
  removeSource(source: Source) {
    removeFromArray(this.sources, source);
  }

}
