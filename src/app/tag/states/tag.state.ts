import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable, pipe } from "rxjs";
import { tap } from "rxjs/operators";
import { FilterTagListAction, GetTagsAction } from "../actions/tag.action";
import { ITag } from "../models/tag";
import { TagService } from "../services/tag.service";

export class TagStateModel {
    tags: ITag[];
    filteredTags: string[];
}

@State<TagStateModel>({
    name: 'tagsState',
    defaults: {
        tags: [],
        filteredTags: []
    }
})
@Injectable()
export class TagState {
    constructor(private service: TagService) { }

    @Selector()
    static tags(state: TagStateModel): ITag[] {
        return state.tags;
    }

    @Selector()
    static filteredTags(state: TagStateModel): string[] {
        return state.filteredTags;
    }

    @Action(GetTagsAction)
    getTags({ patchState }: StateContext<TagStateModel>): Observable<ITag[]> {
        return this.service.getTags().pipe(
            tap(x => {
                patchState({
                    tags: x
                })
            })
        );
    }

    @Action(FilterTagListAction)
    filterTagList({getState, patchState}: StateContext<TagStateModel>, { payload }: FilterTagListAction): void {
        const state = getState();

        const filteredTags = state.tags.filter(t => t.name.toLowerCase().indexOf(payload.toLowerCase()) > -1).map(x => x.name);

        patchState({
            filteredTags: filteredTags
        });
    }

}
