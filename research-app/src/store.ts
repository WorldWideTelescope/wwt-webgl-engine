import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import { ImagesetInfo } from "@wwtelescope/engine-vuex";

@Module({
    namespaced: true,
    stateFactory: true,
})
export default class WWTResearchAppModule extends VuexModule {
    hipsCatalogs: ImagesetInfo[] = [];

    @Mutation
    addResearchAppCatalogHips(catalog: ImagesetInfo) {
        const index = this.hipsCatalogs.indexOf(catalog);
        if (index < 0) {
            this.hipsCatalogs.push(catalog);
        }
    }

    @Mutation
    removeResearchAppCatalogHips(catalog: ImagesetInfo) {
        const index = this.hipsCatalogs.indexOf(catalog);
        if (index >= 0) {
            this.hipsCatalogs.splice(index, 1);
        }
    }

}