import { IAssetDraft } from "../models/asset";

export class OpenAssetFormAction {
    static readonly type = '[Assets] OpenAssetFormAction';
    constructor() { }
}

export class CloseAssetFormAction {
    static readonly type = '[Assets] CloseAssetFormAction';
    constructor() { }
}

export class GetAssetsAction {
    static readonly type = '[Assets] GetAssetsAction';
    constructor() { }
}

export class CreateAssetAction {
    static readonly type = '[Assets] CreateAssetAction';
    constructor(public payload: IAssetDraft) { }
}

export class AddTagToAssetFormAction {
    static readonly type = '[Assets] AddTagToAssetFormAction';
    constructor(public payload: string) { }
}

export class RemoveTagFromAssetFormAction {
    static readonly type = '[Assets] RemoveTagFromAssetFormAction';
    constructor(public payload: string) { }
}

export class RemoveAssetAction {
    static readonly type = '[Assets] RemoveAssetAction';
    constructor(public id: number) { }
}