// Copyright 2023-2024 the .NET Foundation
// Licensed under the MIT License

// Web GL support for annotations.
//
// Annotations all share a set of supporting primitives. Each time any
// annotation changes the primitives, they must be regenerated if they have been
// drawn already. It is best to do updates in large batches.

import { registerType } from "./typesystem.js";
import { ss } from "./ss.js";
import { Matrix3d, Vector3d } from "./double3d.js";
import { Dates, LineList, TriangleList, TriangleFanList, PointList } from "./graphics/primitives3d.js";
import { Tessellator } from "./graphics/tessellator.js";
import { Color, Colors } from "./color.js";
import { Coordinates } from "./coordinates.js";


// wwtlib.AnnotationBatch

export function AnnotationBatch() {
  this.items = [];
  this.pointList = null;
  this.lineList = null;
  this.triangleFanPointList = null;
  this.triangleList = null;
  this.viewTransform = null;
  this._dirty = true;
}

var AnnotationBatch$ = {
    add: function (annotation) {
        this.items.push(annotation);
        this.markDirty(true); 
    },

    remove: function (annotation) {
        ss.remove(this.items, annotation);
        this.markDirty(true); 
    },

    prepBatch: function (renderContext) {
        if (this.pointList == null || this._dirty) {
            this.pointList = new PointList(renderContext);
            this.lineList = new LineList();
            this.triangleFanPointList = new TriangleFanList();
            this.triangleList = new TriangleList();
            this.lineList.set_depthBuffered(false);
            this.triangleList.depthBuffered = false;
        }
        this.markDirty(false);
    },

    _drawCommands: function (renderContext) {
        if (this.pointList != null) {
            this.pointList.draw(renderContext, 1, false);
        }
        if (this.lineList != null) {
            this.lineList.drawLines(renderContext, 1);
        }
        if (this.triangleFanPointList != null) {
            this.triangleFanPointList.draw(renderContext, 1);
        }
        if (this.triangleList != null) {
            this.triangleList.draw(renderContext, 1, 0);
        }
    },

    drawBatch: function (renderContext) {
        this.markDirty(false);
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].draw(renderContext, this);
        }
        if (this.viewTransform != null) {
            var matrix = this.viewTransform instanceof Matrix3d ? this.viewTransform : this.viewTransform(renderContext);
            renderContext.executeWithWorldTransform(matrix, this._drawCommands);
        } else {
            this._drawCommands(renderContext);
        }
    },

    markDirty: function (dirty) {
        this._dirty = dirty;
    },
};

registerType("AnnotationBatch", [AnnotationBatch, AnnotationBatch$, null]);


// wwtlib.Annotation

export function Annotation() {
    this.addedToPrimitives = false;
    this.annotationDirty = true;
    this._opacity = 1;
    this._showHoverLabel = false;
}

Annotation.separation = function (Alpha1, Delta1, Alpha2, Delta2) {
    Delta1 = Delta1 / 180 * Math.PI;
    Delta2 = Delta2 / 180 * Math.PI;
    Alpha1 = Alpha1 / 12 * Math.PI;
    Alpha2 = Alpha2 / 12 * Math.PI;
    var x = Math.cos(Delta1) * Math.sin(Delta2) - Math.sin(Delta1) * Math.cos(Delta2) * Math.cos(Alpha2 - Alpha1);
    var y = Math.cos(Delta2) * Math.sin(Alpha2 - Alpha1);
    var z = Math.sin(Delta1) * Math.sin(Delta2) + Math.cos(Delta1) * Math.cos(Delta2) * Math.cos(Alpha2 - Alpha1);
    var vvalue = Math.atan2(Math.sqrt(x * x + y * y), z);
    vvalue = vvalue / Math.PI * 180;
    if (vvalue < 0) {
        vvalue += 180;
    }
    return vvalue;
};

Annotation.colorToUint = function (col) {
    return (col.a) << 24 | (col.r << 16) | (col.g) << 8 | col.b;
};

Annotation.colorToUintAlpha = function (col, opacity) {
    return opacity << 24 | col.r << 16 | col.g << 8 | col.b;
};

var Annotation$ = {
    draw: function (renderContext, batch) { },

    get_opacity: function () {
        return this._opacity;
    },

    set_opacity: function (value) {
        this.markDirty(true);
        this._opacity = value;
        return value;
    },

    get_id: function () {
        return this._id;
    },

    set_id: function (value) {
        this._id = value;
        return value;
    },

    get_tag: function () {
        return this._tag;
    },

    set_tag: function (value) {
        this._tag = value;
        return value;
    },

    get_label: function () {
        return this._label;
    },

    set_label: function (value) {
        this._label = value;
        return value;
    },

    get_showHoverLabel: function () {
        return this._showHoverLabel;
    },

    set_showHoverLabel: function (value) {
        this._showHoverLabel = value;
        return value;
    },

    hitTest: function (renderContext, RA, dec, x, y) {
        return false;
    },

    get_center: function () {
        return this.center;
    },

    set_center: function (value) {
        this.markDirty(true);
        this.center = value;
        return value;
    },

    markDirty: function (dirty) {
        this.annotationDirty = dirty;
    },
};

registerType("Annotation", [Annotation, Annotation$, null]);


// wwtlib.Circle

export function Circle() {
    this._fill$1 = false;
    this._skyRelative$1 = false;
    this._strokeWidth$1 = 1;
    this._radius$1 = 10;
    this._lineColor$1 = Colors.get_white();
    this._fillColor$1 = Colors.get_white();
    this._x$1 = 0;
    this._y$1 = 0;
    Annotation.call(this);
}

var Circle$ = {
    get_fill: function () {
        return this._fill$1;
    },

    set_fill: function (value) {
        this.markDirty(true);
        this._fill$1 = value;
        return value;
    },

    get_skyRelative: function () {
        return this._skyRelative$1;
    },

    set_skyRelative: function (value) {
        this.markDirty(true);
        this._skyRelative$1 = value;
        return value;
    },

    get_lineWidth: function () {
        return this._strokeWidth$1;
    },

    set_lineWidth: function (value) {
        this.markDirty(true);
        this._strokeWidth$1 = value;
        return value;
    },

    get_radius: function () {
        return this._radius$1;
    },

    set_radius: function (value) {
        this.markDirty(true);
        this._radius$1 = value;
        return value;
    },

    get_lineColor: function () {
        return this._lineColor$1.toString();
    },

    set_lineColor: function (value) {
        this.markDirty(true);
        this._lineColor$1 = Color.load(value);
        return value;
    },

    get_fillColor: function () {
        return this._fillColor$1.toString();
    },

    set_fillColor: function (value) {
        this.markDirty(true);
        this._fillColor$1 = Color.fromName(value);
        return value;
    },

    setCenter: function (x, y) {
        this.markDirty(true);
        this._x$1 = x / 15;
        this._y$1 = y;
        this.center = Coordinates.raDecTo3d(this._ra$1, this._dec$1);
    },

    draw: function (renderContext, batch) {
        var onScreen = true;

        var rad = this._radius$1;
        if (this._skyRelative$1) {
            rad /= renderContext.get_fovScale() / 3600;
        }

        var screenSpacePnt = renderContext.WVP.transform(this.center);
        if (screenSpacePnt.z < 0) {
            onScreen = false;
        }

        if (Vector3d.dot(renderContext.get_viewPoint(), this.center) < 0.55) {
            onScreen = false;
        }

        if (renderContext.gl != null) {
            if (this.annotationDirty) {
                batch.markDirty(true);
                var up = Vector3d.create(0, 1, 0);
                var xNormal = Vector3d.cross(this.center, up);
                var yNormal = Vector3d.cross(this.center, xNormal);

                // Here we guard, lamely, against div-by-0; circles at decs of
                // +-90 will surely not render well.
                var cosdec = Math.cos(this._y$1 * Math.PI / 180)
                cosdec = Math.max(cosdec, 1e-5);
                var r = this._radius$1 * Math.PI / (180 * cosdec);

                var segments = 72;
                var radiansPerSegment = Math.PI * 2 / segments;
                var vertexList = [];

                for (var j = 0; j <= segments; j++) {
                    var x = Math.cos(j * radiansPerSegment) * r;
                    var y = Math.sin(j * radiansPerSegment) * r;
                    vertexList.push(
                        Vector3d.create(
                            this.center.x + x * xNormal.x + y * yNormal.x,
                            this.center.y + x * xNormal.y + y * yNormal.y,
                            this.center.z + x * xNormal.z + y * yNormal.z
                        )
                    );
                }

                if (this._strokeWidth$1 > 0 && vertexList.length > 1) {
                    var lineColorWithOpacity = this._lineColor$1._clone();
                    lineColorWithOpacity.a = Math.round(lineColorWithOpacity.a * this.get_opacity());

                    for (var i = 0; i < vertexList.length - 1; i++) {
                        batch.lineList.addLine(vertexList[i], vertexList[i + 1], lineColorWithOpacity, new Dates(0, 1));
                    }
                }

                if (this._fill$1) {
                    var fillColorWithOpacity = this._fillColor$1._clone();
                    fillColorWithOpacity.a = Math.round(fillColorWithOpacity.a * this.get_opacity());
                    var pos = Vector3d.create(this.center.x, this.center.y, this.center.z);
                    vertexList.splice(0, 0, pos);
                    batch.triangleFanPointList.addShape(vertexList, fillColorWithOpacity, new Dates(0, 1));
                }

                this.annotationDirty = false;
            }
        } else {
            if (onScreen) {
                var ctx = renderContext.device;
                ctx.save();
                ctx.globalAlpha = this.get_opacity();
                ctx.beginPath();
                ctx.arc(screenSpacePnt.x, screenSpacePnt.y, rad, 0, Math.PI * 2, true);
                ctx.lineWidth = this._strokeWidth$1;
                ctx.fillStyle = this._fillColor$1.toString();
                if (this._fill$1) {
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                ctx.strokeStyle = this._lineColor$1.toString();
                ctx.stroke();
                ctx.restore();
            }
        }
    },

    hitTest: function (renderContext, RA, dec, x, y) {
        if (ss.emptyString(this.get_id())) {
            return false;
        }
        var rad = this._radius$1;
        if (!this._skyRelative$1) {
            rad *= renderContext.get_fovScale() / 3600;
        }
        return Annotation.separation(RA, dec, this._x$1, this._y$1) < rad;
    }
};

registerType("Circle", [Circle, Circle$, Annotation]);


// wwtlib.Poly

export function Poly() {
    this._points$1 = [];
    this._fill$1 = false;
    this._strokeWidth$1 = 1;
    this._lineColor$1 = Colors.get_white();
    this._fillColor$1 = Colors.get_white();
    Annotation.call(this);
}

var Poly$ = {
    addPoint: function (x, y) {
        this.markDirty(true);
        this._points$1.push(Coordinates.raDecTo3d(x / 15, y));
    },

    get_fill: function () {
        return this._fill$1;
    },

    set_fill: function (value) {
        this.markDirty(true);
        this._fill$1 = value;
        return value;
    },

    get_lineWidth: function () {
        return this._strokeWidth$1;
    },

    set_lineWidth: function (value) {
        this.markDirty(true);
        this._strokeWidth$1 = value;
        return value;
    },

    get_lineColor: function () {
        return this._lineColor$1.toString();
    },

    set_lineColor: function (value) {
        this.markDirty(true);
        this._lineColor$1 = Color.fromName(value);
        return value;
    },

    get_fillColor: function () {
        return this._fillColor$1.toString();
    },

    set_fillColor: function (value) {
        this.markDirty(true);
        this._fillColor$1 = Color.fromName(value);
        return value;
    },

    draw: function (renderContext, batch) {
        if (renderContext.gl != null) {
            if (this.annotationDirty) {
                batch.markDirty(true);
                //todo can we save this work for later?
                var vertexList = this._points$1;

                if (this._strokeWidth$1 > 0 && this._points$1.length > 1) {
                    var lineColorWithOpacity = this._lineColor$1._clone();
                    lineColorWithOpacity.a = Math.round(lineColorWithOpacity.a * this.get_opacity());
                    for (var i = 0; i < (this._points$1.length - 1); i++) {
                        batch.lineList.addLine(vertexList[i], vertexList[i + 1], lineColorWithOpacity, new Dates(0, 1));
                    }
                    batch.lineList.addLine(vertexList[this._points$1.length - 1], vertexList[0], lineColorWithOpacity, new Dates(0, 1));
                }
                if (this._fill$1) {
                    var fillColorWithOpacity = this._fillColor$1._clone();
                    fillColorWithOpacity.a = Math.round(fillColorWithOpacity.a * this.get_opacity());
                    var indexes = Tessellator.tesselateSimplePoly(vertexList);
                    for (var i = 0; i < indexes.length; i += 3) {
                        batch.triangleList.addSubdividedTriangles(vertexList[indexes[i]], vertexList[indexes[i + 1]], vertexList[indexes[i + 2]], fillColorWithOpacity, new Dates(0, 1), 2);
                    }
                }
                this.annotationDirty = false;
            }
        } else {
            var ctx = renderContext.device;
            ctx.save();
            ctx.globalAlpha = this.get_opacity();
            ctx.beginPath();
            var first = true;
            var $enum1 = ss.enumerate(this._points$1);
            while ($enum1.moveNext()) {
                var pnt = $enum1.current;
                var screenSpacePnt = renderContext.WVP.transform(pnt);
                if (screenSpacePnt.z < 0) {
                    ctx.restore();
                    return;
                }
                if (Vector3d.dot(renderContext.get_viewPoint(), pnt) < 0.75) {
                    ctx.restore();
                    return;
                }
                if (first) {
                    first = false;
                    ctx.moveTo(screenSpacePnt.x, screenSpacePnt.y);
                }
                else {
                    ctx.lineTo(screenSpacePnt.x, screenSpacePnt.y);
                }
            }
            ctx.closePath();
            ctx.lineWidth = this._strokeWidth$1;
            if (this._fill$1) {
                ctx.fillStyle = this._fillColor$1.toString();
                ctx.fill();
            }
            ctx.strokeStyle = this._lineColor$1.toString();
            ctx.globalAlpha = 1;
            ctx.stroke();
            ctx.restore();
        }
    }
};

registerType("Poly", [Poly, Poly$, Annotation]);


// wwtlib.PolyLine

export function PolyLine() {
    this._points$1 = [];
    this._strokeWidth$1 = 1;
    this._lineColor$1 = Colors.get_white();
    Annotation.call(this);
}

var PolyLine$ = {
    addPoint: function (x, y) {
        this.markDirty(true);
        this._points$1.push(Coordinates.raDecTo3d(x / 15, y));
    },

    get_lineWidth: function () {
        return this._strokeWidth$1;
    },

    set_lineWidth: function (value) {
        this.markDirty(true);
        this._strokeWidth$1 = value;
        return value;
    },

    get_lineColor: function () {
        return this._lineColor$1.toString();
    },

    set_lineColor: function (value) {
        this.markDirty(true);
        this._lineColor$1 = Color.fromName(value);
        return value;
    },

    draw: function (renderContext, batch) {
        if (renderContext.gl != null) {
            if (this.annotationDirty) {
                batch.markDirty(true);
                //todo can we save this work for later?
                var vertexList = this._points$1;
                if (this._strokeWidth$1 > 0) {
                    var lineColorWithOpacity = this._lineColor$1._clone();
                    lineColorWithOpacity.a = Math.round(lineColorWithOpacity.a * this.get_opacity());
                    for (var i = 0; i < (this._points$1.length - 1); i++) {
                        batch.lineList.addLine(vertexList[i], vertexList[i + 1], lineColorWithOpacity, new Dates(0, 1));
                    }
                }
                this.annotationDirty = false;
            }
        } else {
            var ctx = renderContext.device;
            ctx.save();
            ctx.globalAlpha = this.get_opacity();
            var first = true;
            var $enum1 = ss.enumerate(this._points$1);
            while ($enum1.moveNext()) {
                var pnt = $enum1.current;
                var screenSpacePnt = renderContext.WVP.transform(pnt);
                if (screenSpacePnt.z < 0) {
                    ctx.restore();
                    return;
                }
                if (Vector3d.dot(renderContext.get_viewPoint(), pnt) < 0.75) {
                    ctx.restore();
                    return;
                }
                if (first) {
                    first = false;
                    ctx.beginPath();
                    ctx.moveTo(screenSpacePnt.x, screenSpacePnt.y);
                }
                else {
                    ctx.lineTo(screenSpacePnt.x, screenSpacePnt.y);
                }
            }
            ctx.lineWidth = this._strokeWidth$1;
            ctx.strokeStyle = this._lineColor$1.toString();
            ctx.stroke();
            ctx.restore();
        }
    }
};

registerType("PolyLine", [PolyLine, PolyLine$, Annotation]);
