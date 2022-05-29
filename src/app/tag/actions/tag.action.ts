import { ITag } from "../models/tag";

export class GetTagsAction {
    static readonly type = '[Tags] GetTagsAction';
    constructor() { }
}

// export class CreateTagAction {
//     static readonly type = '[Tags] CreateTagAction';
//     constructor(public payload: ITag) { }
// }

export class FilterTagListAction {
    static readonly type = '[Tags] FilterTagListAction';
    constructor(public payload: string) { }
}
