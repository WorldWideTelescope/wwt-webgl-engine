// Copyright 2023 the .NET Foundation
// Licensed under the MIT License

// A type representing a WebGL texture array.

import { registerType } from "../typesystem.js";
import { ss } from "../ss.js";
import { tilePrepDevice } from "../render_globals.js";
import { URLHelpers } from "../url_helpers.js";
import { WEBGL } from "./webgl_constants.js";
import { downloadImageData, resizeToPowerOfTwo } from "./texture_utils.js";


// wwtlib.TextureArray

export function TextureArray() {
    this.texture3d = null;
    this.URLs = [];
    this._imageElements = null;
    this._downloading = false;
}

TextureArray.fromUrls = function (urls) {
    var arr = new TextureArray();
    arr.load(urls);
    return arr;
}

var TextureArray$ = {
    cleanUp: function () {
        tilePrepDevice.deleteTexture(this.texture3d);
        this.imageElements = null;
    },

    dispose: function () {
        this.cleanUp();
    },

    load: function (urls) {
        this.URLs = urls;
        var $this = this;
        this._loadingFlags = 0;
        if (typeof document === "undefined") { return; }
        if (!this._downloading) {
            this._downloading = true;
            for (let index = 0; index < this.URLs.length; index++) {
                downloadImageData(this.URLs[index],
                  function () {
                    $this._loadingFlags = $this._loadingFlags | Math.exp(2, index);
                    if ($this._loadingFlags == Math.exp(2, $this.URLs.length - 1)) {
                        $this.makeTexture();
                    }
                  },
                  function (_error) { $this._errored = true; }
                );
            }
        }
    },

    makeTexture: function () {
        if (tilePrepDevice != null) {
            try {
                this.texture3d = tilePrepDevice.createTexture();
                tilePrepDevice.bindTexture(WEBGL.TEXTURE_2D_ARRAY, this.texture3d);
                
                tilePrepDevice.texParameteri(WEBGL.TEXTURE_2D_ARRAY, WEBGL.TEXTURE_WRAP_S, WEBGL.CLAMP_TO_EDGE);
                tilePrepDevice.texParameteri(WEBGL.TEXTURE_2D_ARRAY, WEBGL.TEXTURE_WRAP_T, WEBGL.CLAMP_TO_EDGE);

                // Allocate the storage for the texture array
                // We're making the implicit assumption here that each image has the same size
                // after the power of two resizing
                var firstElement = this.imageElements[0];
                firstElement = resizeToPowerOfTwo(firstElement);
                tilePrepDevice.texImage3D(WEBGL.TEXTURE_2D_ARRAY, 0, WEBGL.RGBA, firstElement.width, firstElement.height, this.imageElements.length, 0, WEBGL.RGBA, WEBGL.UNSIGNED_BYTE, null);

                for (let index = 0; index < this.imageElements.length; index++) {
                    var image = this.imageElements[index];

                    // Before we bind resize to a power of two if necessary so we can MIPMAP
                    image = resizeToPowerOfTwo(image);
                    
                    tilePrepDevice.texSubImage3D(WEBGL.TEXTURE_2D_ARRAY, 0, 0, 0, index, WEBGL.RGBA, WEBGL.UNSIGNED_BYTE, image);
                }

                tilePrepDevice.texParameteri(WEBGL.TEXTURE_2D_ARRAY, WEBGL.TEXTURE_MIN_FILTER, WEBGL.LINEAR_MIPMAP_NEAREST);
                tilePrepDevice.generateMipmap(WEBGL.TEXTURE_2D_ARRAY); 
                tilePrepDevice.bindTexture(WEBGL.TEXTURE_2D_ARRAY, null);
            } catch (error) {
                this._errored = true;
            }
        }
    }
};

registerType("TextureArray", [TextureArray, TextureArray$, null, ss.IDisposable]);
