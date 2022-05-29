import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ITag } from 'src/app/tag/models/tag';
import { TagService } from 'src/app/tag/services/tag.service';
import { TagState, TagStateModel } from 'src/app/tag/states/tag.state';
import { OpenAssetFormAction, CloseAssetFormAction, GetAssetsAction, AddTagToAssetFormAction, CreateAssetAction, RemoveAssetAction, RemoveTagFromAssetFormAction } from '../actions/asset.action';
import { AssetType } from '../enums/asset-type.enum';
import { IAsset, IAssetDraft } from '../models/asset';
import { AssetService } from '../services/asset.service';
import { AssetState, AssetStateModel } from './asset.state';

describe('AssetState', () => {
    let store: Store;

    let fakeAssetService: any;
    let fakeTagService: any;

    const tagList1: ITag[] = [
        { id: 1, name: "tag1" },
        { id: 2, name: "tag2" },
    ];

    const tagList2: ITag[] = [
        { id: 2, name: "tag2" },
        { id: 3, name: "tag3" },
    ];

    const assetList: IAsset[] = [
        { id: 1, name: "Asset1", description: "Description 1", assetType: AssetType.Asset, minVersion: 4.10, maxVersion: 4.27, url: "https://github.com/", tags: tagList1 },
        { id: 2, name: "Asset2", description: "Description 2", assetType: AssetType.EnginePugin, minVersion: 4.11, url: "https://github.com/", tags: tagList2 },
        { id: 3, name: "Asset3", description: "Description 3", assetType: AssetType.FullProject, minVersion: 4.12, maxVersion: 5.00, url: "https://github.com/", tags: [] }
    ];

    beforeEach(() => {

        fakeAssetService = jasmine.createSpyObj(["getAssets", "createAsset", "removeAsset"]);
        fakeTagService = jasmine.createSpyObj(["getTags", "createTag"]);


        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([AssetState, TagState])],
            providers: [
                { provide: AssetService, useValue: fakeAssetService },
                { provide: TagService, useValue: fakeTagService }
            ]
        });

        store = TestBed.inject(Store);

        store.reset({
            ...store.snapshot(),
            assetsState: {
                isAddingAsset: false,
                assets: [],
                addedTags: [],
            },
            tagsState: {
                tags: [],
                filteredTags: []
            }
        });
    });

    // selectors
    it('Select state', () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        expect(state).toBeTruthy();
    });

    it('Select isAddingAsset', () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        expect(state.isAddingAsset).toEqual(false);
    });

    it('Select assets', () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        expect(state.assets).toEqual([]);
    });

    it('Select addedTags', () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        expect(state.addedTags).toEqual([]);
    });

    // actions
    it('Action OpenAssetFormAction', () => {
        store.dispatch(new OpenAssetFormAction());

        const expectedResult = true;
        const state = store.selectSnapshot(AssetState);

        expect(state.isAddingAsset).toEqual(expectedResult);
    });

    it('Action CloseAssetFormAction', () => {
        store.dispatch(new CloseAssetFormAction());

        const expectedResult = false;
        const state = store.selectSnapshot(AssetState);

        expect(state.isAddingAsset).toEqual(expectedResult);
    });

    it('Action GetAssetsAction', async () => {
        fakeAssetService.getAssets.and.returnValue(of(assetList));

        await store.dispatch(new GetAssetsAction()).toPromise();

        const state: AssetStateModel = store.selectSnapshot(AssetState);

        expect(state.assets).toEqual(assetList);
    });

    it('Action CreateAssetAction', async () => {
        const baseAssetsState: AssetStateModel = store.selectSnapshot(AssetState);

        baseAssetsState.assets = [
            { id: 1, name: "Asset1", description: "Description 1", assetType: AssetType.Asset, minVersion: 4.10, maxVersion: 4.27, url: "https://github.com/", tags: tagList1 },
            { id: 2, name: "Asset2", description: "Description 2", assetType: AssetType.EnginePugin, minVersion: 4.11, url: "https://github.com/", tags: tagList2 }
        ];
        baseAssetsState.addedTags = ["tag2", "tag3"];

        const tagsState: TagStateModel = store.selectSnapshot(TagState);

        tagsState.tags = [
            { id: 1, name: "Tag1" },
            { id: 2, name: "Tag2" }
        ];

        let newAsset: IAssetDraft = { name: "Asset3", description: "Description 3", assetType: AssetType.FullProject, minVersion: 4.12, maxVersion: 5.00, url: "https://github.com/" };

        fakeAssetService.createAsset.and.returnValue(of(assetList[assetList.length - 1]));
        fakeAssetService.getAssets.and.returnValue(of(assetList));
        await store.dispatch(new CreateAssetAction(newAsset)).toPromise();

        const newAssetsState: AssetStateModel = store.selectSnapshot(AssetState);


        expect(newAssetsState.assets).toEqual(assetList);
        expect(newAssetsState.isAddingAsset).toEqual(false);
    });

    it('Action AddTagToAssetFormAction', () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        state.addedTags = ["Tag1"];

        const tagState: TagStateModel = store.selectSnapshot(TagState);
        tagState.tags = [
            { id: 1, name: "Tag1" },
            { id: 2, name: "Tag2" },
            { id: 3, name: "Tag3" },
            { id: 4, name: "Newtag1" },
        ];

        const newTag = "newtag1"
        store.dispatch(new AddTagToAssetFormAction(newTag));

        const expectedResult: string[] = ["Tag1", "Newtag1"];

        const addedTags: string[] = store.selectSnapshot(AssetState.addedTags);
        expect(addedTags).toEqual(expectedResult);
    });

    it('Action AddTagToAssetFormAction2', () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        state.addedTags = ["Tag1"];

        const tagState: TagStateModel = store.selectSnapshot(TagState);
        tagState.tags = [
            { id: 1, name: "Tag1" },
            { id: 2, name: "Tag2" },
            { id: 3, name: "Tag3" },
        ];

        const newTag = "newtag1"
        store.dispatch(new AddTagToAssetFormAction(newTag));

        const expectedResult: string[] = ["Tag1", "Newtag1"];

        const addedTags: string[] = store.selectSnapshot(AssetState.addedTags);
        expect(addedTags).toEqual(expectedResult);
    });

    it('Action AddTagToAssetFormAction3', () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        state.addedTags = ["Tag1", "Newtag1"];

        const tagState: TagStateModel = store.selectSnapshot(TagState);
        tagState.tags = [
            { id: 1, name: "Tag1" },
            { id: 2, name: "Tag2" },
            { id: 3, name: "Tag3" },
        ];

        const newTag = "newtag1"
        store.dispatch(new AddTagToAssetFormAction(newTag));

        const expectedResult: string[] = ["Tag1", "Newtag1"];

        const addedTags: string[] = store.selectSnapshot(AssetState.addedTags);
        expect(addedTags).toEqual(expectedResult);
    });

    it('Action RemoveTagFromAssetFormAction', () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        state.addedTags = ["tag1", "tag2", "tag3"];

        const expectedResult = ["tag1", "tag3"]

        const tagToRemove = "tag2";

        store.dispatch(new RemoveTagFromAssetFormAction(tagToRemove));

        const newAddedTags = store.selectSnapshot(AssetState.addedTags);

        expect(newAddedTags).toEqual(expectedResult);
    });

    it('Action RemoveAssetAction', async () => {
        const state: AssetStateModel = store.selectSnapshot(AssetState);
        state.assets = assetList;

        const idAssetToRemove = 3;

        const expectedResult = [
            { id: 1, name: "Asset1", description: "Description 1", assetType: AssetType.Asset, minVersion: 4.10, maxVersion: 4.27, url: "https://github.com/", tags: tagList1 },
            { id: 2, name: "Asset2", description: "Description 2", assetType: AssetType.EnginePugin, minVersion: 4.11, url: "https://github.com/", tags: tagList2 }
        ];

        fakeAssetService.removeAsset.and.returnValue(of(''));
        await store.dispatch(new RemoveAssetAction(idAssetToRemove)).toPromise();

        const newAssets: IAsset[] = store.selectSnapshot(AssetState.assets);

        expect(newAssets).toEqual(expectedResult);
    });
});