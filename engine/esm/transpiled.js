import { ss } from "./ss.js";
import { registerType } from "./typesystem.js";

import {
  set_globalRenderContext,
} from "./render_globals.js";

import {
  set_globalWWTControl,
} from "./data_globals.js";

import { SpaceTimeController } from "./space_time_controller.js";
import { KeplerVertex } from "./kepler_vertex.js";
import { Dialog } from "./utilities/dialog.js";

import { LayerManager } from "./layers/layer_manager.js";

import { Folder } from "./folder.js";
import { RenderContext } from "./render_context.js";
import { WWTControl } from "./wwt_control.js";


// wwtlib.FrameWizard

export function FrameWizard() {
  Dialog.call(this);
}

var FrameWizard$ = {
  OK: function (frame) {
    LayerManager.referenceFrameWizardFinished(frame);
  }
};

registerType("FrameWizard", [FrameWizard, FrameWizard$, Dialog]);

// wwtlib.ReferenceFrameProps

export function ReferenceFrameProps() {
  Dialog.call(this);
}

var ReferenceFrameProps$ = {
  OK: function (frame) {
    LayerManager.loadTree();
  }
};

registerType("ReferenceFrameProps", [ReferenceFrameProps, ReferenceFrameProps$, Dialog]);

// wwtlib.GreatCircleDialog

export function GreatCircleDialog() {
  Dialog.call(this);
}

var GreatCircleDialog$ = {
  OK: function (frame) { }
};

registerType("GreatCircleDialog", [GreatCircleDialog, GreatCircleDialog$, Dialog]);

// wwtlib.DataVizWizard

export function DataVizWizard() {
  Dialog.call(this);
}

var DataVizWizard$ = {
  OK: function () { }
};

registerType("DataVizWizard", [DataVizWizard, DataVizWizard$, Dialog]);

// Statics with nontrivial initialization:

LayerManager._frameWizardDialog = new FrameWizard();
LayerManager._dataVizWizardDialog = new DataVizWizard();
LayerManager._referenceFramePropsDialog = new ReferenceFrameProps();
LayerManager._greatCircleDialog = new GreatCircleDialog();

WWTControl.exploreRoot = new Folder();
WWTControl.singleton = new WWTControl();
WWTControl.singleton.renderContext = new RenderContext();
set_globalWWTControl(WWTControl.singleton);
set_globalRenderContext(WWTControl.singleton.renderContext);

SpaceTimeController._metaNow = ss.now();
SpaceTimeController._now = ss.now();
SpaceTimeController.last = SpaceTimeController.get_metaNow();
SpaceTimeController.updateClock();

KeplerVertex.baseDate = ss.truncate(SpaceTimeController.utcToJulian(ss.now()));
