// Copyright 2023 the .NET Foundation
// Licensed under the MIT License

// A type representing a WebGL texture array.

import { registerType } from "../typesystem.js";
import { ss } from "../ss.js";
import { tilePrepDevice } from "../render_globals.js";
import { WEBGL } from "./webgl_constants.js";
import { downloadImageData, resizeToPowerOfTwo } from "./texture_utils.js";


// wwtlib.TextureArray

export function TextureArray() {
    this.texture2dArray = null;
    this.URLs = [];
    this._imageElements = [];
    this._downloading = false;
}

TextureArray.fromUrls = function (urls) {
    var arr = new TextureArray();
    arr.load(urls);
    return arr;
}

var TextureArray$ = {
    cleanUp: function () {
        tilePrepDevice.deleteTexture(this.texture2dArray);
        this.imageElements.length = 0;
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
                var img = downloadImageData(this.URLs[index],
                  function () {
                    $this._loadingFlags = $this._loadingFlags | Math.pow(2, index);
                    if ($this._loadingFlags == Math.pow(2, $this.URLs.length) - 1) {
                        $this.makeTexture();
                    }
                  },
                  function (_error) { $this._errored = true; }
                );
                this._imageElements.push(img);
            }
        }
    },

    makeTexture: function () {
        if (tilePrepDevice != null) {
            try {
                this.texture2dArray = tilePrepDevice.createTexture();
                tilePrepDevice.bindTexture(WEBGL.TEXTURE_2D_ARRAY, this.texture2dArray);
                console.log(tilePrepDevice.getParameter(WEBGL.TEXTURE_BINDING_2D_ARRAY));
                
                tilePrepDevice.texParameteri(WEBGL.TEXTURE_2D_ARRAY, WEBGL.TEXTURE_WRAP_S, WEBGL.CLAMP_TO_EDGE);
                tilePrepDevice.texParameteri(WEBGL.TEXTURE_2D_ARRAY, WEBGL.TEXTURE_WRAP_T, WEBGL.CLAMP_TO_EDGE);

                // Allocate the storage for the texture array
                // We're making the implicit assumption here that each image has the same size
                // after the power of two resizing
                var firstElement = this._imageElements[0];
                firstElement = resizeToPowerOfTwo(firstElement);
                tilePrepDevice.texStorage3D(WEBGL.TEXTURE_2D_ARRAY, 1, WEBGL.RGBA8, firstElement.width, firstElement.height, this._imageElements.length);

                for (let index = 0; index < this._imageElements.length; index++) {
                    var image = this._imageElements[index];

                    // Before we bind resize to a power of two if necessary so we can MIPMAP
                    image = resizeToPowerOfTwo(image);
                    
                    tilePrepDevice.texSubImage3D(WEBGL.TEXTURE_2D_ARRAY, 0, 0, 0, index, image.width, image.height, 1, WEBGL.RGBA, WEBGL.UNSIGNED_BYTE, image);
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
