import { TemplateRef } from "@angular/core";
import { IProject } from "../models/project";
import { IPostRankedAsset } from "../models/ranked-asset";

export class GetProjectsAction {
    static readonly type = '[Projects] GetProjectsAction';

    constructor() { }
}

export class CreateProjectAction {
    static readonly type = '[Projects] CreateProjectsAction';

    constructor(public name: string, public description: string) { }
}

export class InitDraftProjectAction {
    static readonly type = '[Project] InitProjectAction';

    constructor() { }
}

export class LockAddButtonAction {
    static readonly type = '[Project] LockAddButton';
    constructor() { }
}

export class UnlockAddButtonAction {
    static readonly type = '[Project] UnlockAddButton';
    constructor() { }
}

export class OpenDraftProjectTabAction {
    static readonly type = '[Project] OpenDraftProjectTabAction';
    constructor() { }
}

export class CloseDraftProjectTabAction {
    static readonly type = '[Project] CloseDraftProjectTabAction';
    constructor() { }
}

export class LoadRankedAssetAction {
    static readonly type = '[Project] LoadRankedAssetAction';
    constructor(public projectId: number) { }
}

export class RemoveRankedAssetFromProjectAction {
    static readonly type = '[Project] RemoveRankedAssetFromProjectAction';
    constructor(public id: number) { }
}

export class AddRankedAssetToProjectAction {
    static readonly type = '[Project] AddRankedAssetToProjectAction';
    constructor(public assetId: number, public rank: number) { }
}

export class ChangeActiveProjectAction {
    static readonly type = '[Project] ChangeActiveProjectAction';
    constructor(public projectId: number) { }
}
