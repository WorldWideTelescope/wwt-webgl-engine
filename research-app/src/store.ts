import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ImagesetInfo } from '@wwtelescope/engine-vuex';
import Vue from 'vue';
export interface Source {
    ra: number;
    dec: number;
    name: string;
    catalogName: string;
    zoomDeg?: number;
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
    return (s1.ra === s2.ra) && (s1.dec === s2.dec) && (s1.name === s2.name) && (s1.catalogName === s2.catalogName);
}

@Module({
    namespaced: true,
    stateFactory: true,
})
export class WWTResearchAppModule extends VuexModule {
    
   hipsCatalogs: ImagesetInfo[] = [];
   hipsCatalogVisibilities: boolean[] = [];
   sources: Source[] = [];

   nameColumns: string[] = [
    "2MASS",
    "GSC",          // Guide Star Catalog
    "PPM",
   ];

   get researchAppHipsCatalogVisibility() {
    return (catalog: ImagesetInfo) =>  {
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
    setResearchAppCatalogHipsVisibility(args: { catalog: ImagesetInfo, visible: boolean}) {
        const index = getIndex(this.hipsCatalogs, args.catalog);
        if (index >= 0) {
            Vue.set(this.hipsCatalogVisibilities, index, args.visible);
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
