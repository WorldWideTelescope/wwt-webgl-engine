// Transforms used to manipulate batches (e.g. text or annotation batches)
// for drawing in different coordinate systems without needing to re-buffer data

import { Coordinates } from "./coordinates.js";
import { Matrix3d, Vector3d } from "./double3d.js";
import { SpaceTimeController } from "./space_time_controller.js";

export function Transforms() { }

// Without this matrix, converting from RA/Dec gives
// (RA, Dec) -> (270 - Az, Alt)
// This is a previously known problem - for example, the alt/az grid text
// explicitly offsets by 6 hours = 90 degrees to account for this
// This matrix provides the correct transformation.
// It's done in homogeneous coordinates, but we're just flipping x + z
// and reversing the sign of both
Transforms._horizontalWorldAdjustment = Matrix3d.create(
    0, 0, -1, 0,
    0, 1, 0, 0,
    -1, 0, 0, 0,
    0, 0, 0, 1,
);

Transforms.horizontalToEquatorialWorldTransform = function (_renderContext) {
    var zenithAltAz = new Coordinates(0, 0);
    var zenith = Coordinates.horizonToEquitorial(zenithAltAz, SpaceTimeController.get_location(), SpaceTimeController.get_now());
    var raPart = -((zenith.get_RA() + 6) / 24 * (Math.PI * 2));
    var decPart = -(zenith.get_dec() / 360 * (Math.PI * 2));
    var mat = Matrix3d._rotationY(-raPart);
    mat._multiply(Matrix3d._rotationX(decPart));
    mat.invert();
    mat = Matrix3d.multiplyMatrix(Transforms._horizontalWorldAdjustment, mat);
    return mat;
};

Transforms.overlayToEquatorialWorldTransform = function (position) {
  var overlayWorldInitial = Matrix3d.rotationYawPitchRoll(-(position.get_RA() - 6) * Coordinates.RCRA, -position.get_dec() * Coordinates.RC, 0);
  return function (renderContext) {
    var world = renderContext.get_world().clone();
    world.invert();
    return Matrix3d.multiplyMatrix(overlayWorldInitial, world); 
  }
};

Transforms.overlayToEquatorialViewTransform = function (rotation) {
  var overlayViewInitial = Matrix3d.lookAtLH(
    Vector3d.create(0, 0, 0),
    Vector3d.create(0, 0, -1),
    Vector3d.create(Math.sin(rotation), Math.cos(rotation), 0),
  );
  return function (renderContext) {
    var view = renderContext.get_view().clone();
    view.invert();
    return Matrix3d.multiplyMatrix(overlayViewInitial, view);
  }
};
