// Copyright 2023 the .NET Foundation
// Licensed under the MIT License

// Various global variables associated with the rendering engine.
//
// In the original C# code these were generally static values associated with
// various classes, but since we want to avoid circular dependencies in our
// module structure, we gather some of those values in modules that contain
// minimal amounts of code (like this one) so that they can go early in the
// dependency graph.

// This used to be Tile.prepDevice. It's the global WebGL rendering context.
export var tilePrepDevice = null;

export function set_tilePrepDevice(value) {
    tilePrepDevice = value;
}
