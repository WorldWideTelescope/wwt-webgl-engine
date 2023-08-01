// Copyright 2023 the .NET Foundation
// Licensed under the MIT License

// Various global variables associated with data assets.
//
// See `render_globals.js` for a general rationale for this kind of module.

// This used to be WWTControl(.singleton).freestandingMode. It sets whether the
// engine will avoid accessing the central WWT servers.
export var freestandingMode = false;

export function set_freestandingMode(value) {
    freestandingMode = !!value;
}

// This is equivalent to `new HipsProperties(imageset)`. We abstract
// the function to avoid circular dependencies in the type hierarchy.
export var makeNewHipsProperties = null;

export function set_makeNewHipsProperties(value) {
    makeNewHipsProperties = value;
}
