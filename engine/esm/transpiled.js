import { ss } from "./ss.js";
import { registerType } from "./typesystem.js";

import {
  globalRenderContext,
  set_globalRenderContext,
} from "./render_globals.js";

import {
  set_globalWWTControl,
  set_loadWtmlFile,
} from "./data_globals.js";

import { Imageset } from "./imageset.js";
import { SpaceTimeController } from "./space_time_controller.js";
import { Place } from "./place.js";
import { KeplerVertex } from "./kepler_vertex.js";
import { Dialog } from "./utilities/dialog.js";

import { LayerManager } from "./layers/layer_manager.js";

import { Folder } from "./folder.js";
import { RenderContext } from "./render_context.js";
import { WWTControl } from "./wwt_control.js";


// wwtlib.FolderDownloadAction

export function FolderDownloadAction(action, loadChildFolders) {
  this.loadChildFolders = false;
  this._numLoadingFolders = 0;
  this._onComplete = action;
  this.loadChildFolders = loadChildFolders;
}

var FolderDownloadAction$ = {
  _folderLoaded: function () {
    this._numLoadingFolders--;
    if (!this._numLoadingFolders) {
      this._onComplete();
    }
  },

  startingNewFolderLoad: function (folder) {
    var $this = this;

    this._numLoadingFolders++;
    folder.childLoadCallback(function () {
      Wtml.loadImagesets(folder, $this);
      $this._folderLoaded();
    });
  }
};

registerType("FolderDownloadAction", [FolderDownloadAction, FolderDownloadAction$, null]);

// wwtlib.Wtml

export function Wtml() { }

Wtml.getWtmlFile = function (url, complete, loadChildFolders) {
  if (loadChildFolders == null) {
    loadChildFolders = false;
  }
  var folder = new Folder();
  folder.set_url(url);
  var folderDownloadAction = new FolderDownloadAction(complete, loadChildFolders);
  folderDownloadAction.startingNewFolderLoad(folder);
  return folder;
};

set_loadWtmlFile(Wtml.getWtmlFile);

Wtml.loadImagesets = function (folder, folderDownloadAction) {
  var children = folder.get_children();
  var $enum1 = ss.enumerate(children);
  while ($enum1.moveNext()) {
    var child = $enum1.current;
    if (ss.canCast(child, Imageset)) {
      var imageSet = child;
      WWTControl.addImageSetToRepository(imageSet);
    }
    if (ss.canCast(child, Place)) {
      var place = child;
      if (place.get_studyImageset() != null) {
        WWTControl.addImageSetToRepository(place.get_studyImageset());
      }
      if (place.get_backgroundImageset() != null) {
        WWTControl.addImageSetToRepository(place.get_backgroundImageset());
      }
    }
    if (ss.canCast(child, Folder) && folderDownloadAction.loadChildFolders) {
      folderDownloadAction.startingNewFolderLoad((child));
    }
  }
  if (!ss.emptyString(WWTControl.imageSetName)) {
    var name = WWTControl.imageSetName.toLowerCase();
    var $enum2 = ss.enumerate(WWTControl.getImageSets());
    while ($enum2.moveNext()) {
      var imageset = $enum2.current;
      if (imageset.get_name().toLowerCase() === name) {
        globalRenderContext.set_backgroundImageset(imageset);
      }
    }
  }
};

var Wtml$ = {};

registerType("Wtml", [Wtml, Wtml$, null]);

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
