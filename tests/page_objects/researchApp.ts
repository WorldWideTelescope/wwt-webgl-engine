// @ts-nocheck
// TODO: Add proper TypeScript for this page object
// For now, we just want a compiled .js file to appear in `dist`

const utils = require("../utils");

module.exports = {
  url: "http://localhost:8080",
  commands: [{
    waitForReady: function () {
      return this
        .waitForElementVisible("@app")
        .waitForElementVisible("@wwtComponent");
    },
    
    backgroundCount: async function() {
      const docHandler = (doc) => {
        const items = [...doc.querySelectorAll("ImageSet")];
        return items
          .map(item => item.attributes)
          .filter(attr => attr.FileType.nodeValue != 'tsv' && attr.DataSetType.nodeValue == 'Sky')
          .length;
      };
      const hipsProm = utils.parseXMLFromUrl(this.props.builtinUrl).then(docHandler);
      const builtinProm = utils.parseXMLFromUrl(this.props.hipsUrl).then(docHandler);
      return Promise.all([hipsProm, builtinProm]).then(values => {
        const reducer = (prev, curr) => prev + curr;
        return values.reduce(reducer);
      });
    },

    hipsCount: async function() {
      return utils.parseXMLFromUrl(this.props.hipsUrl)
        .then(doc => {
          const items = [...doc.querySelectorAll("ImageSet")];
          return items.filter(item => item.attributes.FileType.nodeValue == 'tsv').length;
        });
    }
  }],
  props: {
    title: "AAS WorldWide Telescope",
    builtinUrl: "https://web.wwtassets.org/engine/assets/builtin-image-sets.wtml",
    hipsUrl: "http://www.worldwidetelescope.org/wwtweb/catalog.aspx?W=hips",
  },
  elements: {
    app: {
      selector: "#app"
    },
    wwtComponent: {
      selector: ".wwt"
    },
    displayPanel: {
      selector: "#display-panel"
    },
    controls: {
      selector: "#controls"
    },
    tools: {
      selector: "#tools"
    },
    toolMenu: {
      selector: ".tool-menu"
    },
    backgroundButton: {
      selector: ".tool-menu > li > a > .fa-mountain"
    },
    imageryButton: {
      selector: ".tool-menu > li > a > .fa-image"
    },
    catalogButton: {
      selector: ".tool-menu > li > a > .fa-map-marked-alt"
    },
    loadWtmlButton: {
      selector: ".tool-menu > li > a > .fa-photo-video"
    }
  },

  sections: {
    displayPanel: {
      selector: "#display-panel",
      elements: {
        coordinateDisplay: {
          selector: "#overlays > p"
        },
        catalogsContainer: {
          selector: "#  "
        },
        catalogsHeader: {
          selector: "#spreadsheets-container .display-section-header"
        },
        sourcesContainer: {
          selector: "#sources-container"
        },
        sourcesHeader: {
          selector: "#sources-container .display-section-header"
        },
        // We need to specify the catalog container id
        // in case other Vue components use the inner selectors
        // i.e., the source components have a similar structure
        // with some of the same IDs
        catalogItem: {
          selector: "#spreadsheets-container #root-container"
        },
        catalogMainContainer: {
          selector: "#spreadsheets-container #main-container"
        },
        catalogDetailContainer: {
          selector: "#spreadsheets-container .detail-container"
        },
        catalogTitle: {
          selector: "#spreadsheets-container #name-label"
        },
        catalogVisibilityButton: {
          selector: "#spreadsheets-container .fa-eye"
        },
        catalogDeleteButton: {
          selector: "#spreadsheets-container .fa-times"
        },
        imageryItem: {
          selector: "#imagery-container #root-container"
        },
        imageryMainContainer: {
          selector: "#imagery-container #main-container"
        },
        imageryDetailContainer: {
          selector: "#imagery-container .detail-container"
        },
        imageryTitle: {
          selector: "#imagery-container #name-label"
        },
        imageryGotoButton: {
          selector: "#imagery-container .fa-map-marker-alt"
        },
        imageryVisibilityButton: {
          selector: "#imagery-container .fa-eye"
        },
        imageryDeleteButton: {
          selector: "#imagery-container .fa-times"
        },

      },
      props: {
        initialCoordinateText: "17:45:35 -28:53:59",
        phatLayerCoordinates: "00:45:12 +41:45:02", // Both are at the same position
      },
    },
    controls: {
      selector: "#controls",
      elements: {
        controlItem: {
          selector: "li"
        },
        toolChooser: {
          selector: "li .v-popover .fa-sliders-h"
        },
        zoomIn: {
          selector: "li .fa-search-plus"
        },
        zoomOut: {
          selector: "li .fa-search-minus"
        },
        fullScreen: {
          selector: "li .fa-expand"
        }
      },
      props: {
        controlItemCount: 4
      },
    },
    tools: {
      selector: "#tools",
      elements: {
        backgroundSelectionContainer: {
          selector: "#bg-select-container"
        },
        backgroundSelectionTitle: {
          selector: "#bg-select-title"
        },
        selectedBackgroundText: {
          selector: ".vs__selected div"
        },
        backgroundSelectionToggle: {
          selector: ".vs__dropdown-toggle"
        },
        backgroundDropdown: {
          selector: ".vs__dropdown-menu"
        },
        backgroundDropdownOption: {
          selector: ".vs__dropdown-option"
        },
        backgroundDropdownOptionName: {
          selector: ".vs__dropdown-option > div > h4"
        },
        backgroundDropdownOptionDescription: {
          selector: ".vs__dropdown-option > div > p"
        },
        catalogSelectionContainer: {
          selector: "#catalog-select-container-tool"
        },
        catalogSelectionTitle: {
          selector: "#catalog-select-container-tool .item-select-title"
        },
        catalogSelectionToggle: {
          selector: ".vs__dropdown-toggle"
        },
        catalogDropdown: {
          selector: ".vs__dropdown-menu"
        },
        catalogDropdownOption: {
          selector: ".vs__dropdown-option"
        },
        catalogDropdownOptionName: {
          selector: ".vs__dropdown-option > div > h4"
        },
        catalogDropdownOptionDescription: {
          selector: ".vs__dropdown-option > div > p"
        },
        loadWtmlContainer: {
          selector: ".load-collection-container"
        },
        wtmlUrlInput: {
          selector: ".load-collection-container .load-collection-row > input"
        },
        imagerySelectionToggle: {
          selector: ".vs__dropdown-toggle"
        },
        imageryDropdown: {
          selector: ".vs__dropdown-menu"
        },
        imageryDropdownOption: {
          selector: ".vs__dropdown-option"
        },
        imageryDropdownOptionName: {
          selector: ".vs__dropdown-option > div > h4"
        },
      },
      props: function() {
        const firstCatalogName = "The DENIS database (DENIS Consortium, 2005) (denis)";
        return {
          firstBackgroundName: "Digitized Sky Survey (Color)",
          firstBackgroundDescription: "Copyright DSS Consortium",
          firstCatalogName: firstCatalogName,
          firstCatalogRegex: new RegExp(`${utils.escapeRegExp(firstCatalogName)}(\s+)?`),
          phatWtmlUrl: "http://data1.wwtassets.org/packages/2021/09_phat_fits/index.wtml",
          phatImageryCount: 2,
          phatLayerNames: ["PHAT-f475w", "PHAT-f814w"],
        }
      }
    },
  }
}
