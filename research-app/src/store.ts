import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
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

function addToArrayWithoutDuplication<T>(array: T[], item: T): boolean {
    const index = array.indexOf(item);
    if (index < 0) {
        array.push(item);
        return true;
    }
    return false;
}

function removeFromArray<T>(array: T[], item: T): number {
    const index = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return index;
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
        const index = this.hipsCatalogs.indexOf(catalog);
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
        const index = this.hipsCatalogs.indexOf(args.catalog);
        if (index >= 0) {
            Vue.set(this.hipsCatalogVisibilities, index, args.visible);
        }
    }

    @Mutation
    addSource(source: Source) {
        addToArrayWithoutDuplication(this.sources, source);
    }

    @Mutation
    removeSource(source: Source) {
        removeFromArray(this.sources, source);
    }

}
