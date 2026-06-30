import { URLHelpers } from "../url_helpers";

export function downloadImageData(url, onLoad, onError) {
    var imageElement = document.createElement('img');
    imageElement.addEventListener('load', onLoad, false);
    imageElement.addEventListener('error', function (error) {
        if (!imageElement.hasAttribute('proxyattempt')) {
            imageElement.setAttribute('proxyattempt', true);
            var new_url = URLHelpers.singleton.activateProxy(url);
            if (new_url != null) {  // null => don't bother: we know that the proxy won't help
                imageElement.rc = new_url;
                return;
            }
        }
        onError();
    }, false);
    imageElement.crossOrigin = 'anonymous';
    imageElement.src = url;
}

export function isPowerOfTwo(value) {
    return !(value & (value - 1));
}

export function fitPowerOfTwo(value) {
    value--;
    for (var i = 1; i < 32; i <<= 1) {
        value = value | value >> i;
    }
    return value + 1;
}

export function resizeToPowerOfTwo(imageElement) {
    if ((!isPowerOfTwo(imageElement.height) | !isPowerOfTwo(imageElement.width)) === 1) {
        var temp = document.createElement('canvas');
        temp.height = fitPowerOfTwo(imageElement.height);
        temp.width = fitPowerOfTwo(imageElement.width);
        var ctx = temp.getContext('2d');
        ctx.drawImage(imageElement, 0, 0, temp.width, temp.height);
        imageElement = temp;
    }
    return imageElement;
}
