import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { tap } from "rxjs/operators";
// import { CreateTagAction } from "src/app/tag/actions/tag.action";
import { ITag } from "src/app/tag/models/tag";
import { TagState, TagStateModel } from "src/app/tag/states/tag.state";
import { OpenAssetFormAction, CloseAssetFormAction, GetAssetsAction, CreateAssetAction, RemoveTagFromAssetFormAction, AddTagToAssetFormAction, RemoveAssetAction } from "../actions/asset.action";
import { IAsset } from "../models/asset";
import { AssetService } from "../services/asset.service";

export class AssetStateModel {
    isAddingAsset: boolean;
    assets: IAsset[];
    addedTags: string[];
}

@State<AssetStateModel>({
    name: 'assetsState',
    defaults: {
        isAddingAsset: false,
        assets: [],
        addedTags: [],
    }
})
@Injectable()
export class AssetState {

    constructor(private service: AssetService, private store: Store) { }

    @Selector()
    static isAddingAsset(state: AssetStateModel) {
        return state.isAddingAsset;
    }

    @Selector()
    static assets(state: AssetStateModel) {
        return state.assets;
    }

    @Selector()
    static addedTags(state: AssetStateModel) {
        return state.addedTags;
    }

    @Action(OpenAssetFormAction)
    openAssetForm({ patchState }: StateContext<AssetStateModel>) {
        patchState({
            isAddingAsset: true
        });
    }

    @Action(CloseAssetFormAction)
    closeAssetForm({ patchState }: StateContext<AssetStateModel>) {
        patchState({
            isAddingAsset: false
        });
    }

    @Action(GetAssetsAction)
    getAssets({ patchState }: StateContext<AssetStateModel>) {
        return this.service.getAssets().pipe(
            tap(x => {
                patchState({
                    assets: x
                })
            })
        );
    }

    @Action(CreateAssetAction)
    createAsset(ctx: StateContext<AssetStateModel>, { payload }: CreateAssetAction) {
        const state: AssetStateModel = ctx.getState();
        const existingTags: ITag[] = this.store.selectSnapshot(TagState.tags);
        let assetTags: ITag[] = [];

        state.addedTags.forEach(sTag => {
            let filter = existingTags.filter(x => x.name.toLowerCase() == sTag.toLowerCase());
            let tag: ITag;
            if (filter.length) {
                assetTags.push(filter[0]);
            } else {
                assetTags.push({
                    id: 0,
                    name: sTag
                });
            }
        });

        const data: IAsset = {
            id: 0,
            name: payload.name,
            description: payload.description,
            assetType: payload.assetType,
            minVersion: payload.minVersion,
            maxVersion: payload.maxVersion,
            url: payload.url,
            tags: assetTags
        }

        return this.service.createAsset(data).pipe(
            tap(x => {
                ctx.dispatch(new GetAssetsAction());
                ctx.dispatch(new CloseAssetFormAction());
            })
        );
    }

    @Action(AddTagToAssetFormAction)
    addNewTagToAssetForm({getState, patchState}: StateContext<AssetStateModel>, { payload }: AddTagToAssetFormAction) {
        const existingTags = this.store.selectSnapshot(TagState.tags);
        const filteredList: ITag[] = existingTags.filter(x => x.name.toLowerCase() == payload.toLowerCase());
        const state = getState();
        
        let tag: string = null;

        if (filteredList.length) {
            tag = filteredList[0].name;
        } else {
            const lowerName = payload.toLowerCase();
            const firstLetter = lowerName[0].toUpperCase();
            const end = lowerName.slice(1);

            const newName = firstLetter + end;
            tag = newName;
        }

        if (state.addedTags.indexOf(tag) == -1) {
            patchState({
                addedTags: [...state.addedTags, tag]
            });
        }

    }

    @Action(RemoveTagFromAssetFormAction)
    removeTagFromAssetForm({ getState, patchState }: StateContext<AssetStateModel>, { payload }: RemoveTagFromAssetFormAction) {
        const state = getState();

        patchState({
            addedTags: state.addedTags.filter(x => x != payload)
        });
    }

    @Action(RemoveAssetAction)
    removeAsset({ getState, patchState }: StateContext<AssetStateModel>, { id }: RemoveAssetAction) {
        return this.service.removeAsset(id).pipe(
            tap(x => {
                const state = getState();
                patchState({
                    assets: state.assets.filter(x => x.id != id)
                });
            })
        );
    }
}