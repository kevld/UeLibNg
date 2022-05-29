import { TestBed } from "@angular/core/testing";
import { Store, NgxsModule } from "@ngxs/store";
import { of } from "rxjs";
import { FilterTagListAction, GetTagsAction } from "../actions/tag.action";
import { ITag } from "../models/tag";
import { TagService } from "../services/tag.service";
import { TagState, TagStateModel } from "./tag.state";

describe('TagState', () => {
    let store: Store;

    let fakeTagService: any;

    const tagList: ITag[] = [
        { id: 1, name: "Tag1" },
        { id: 2, name: "Tag2" },
        { id: 3, name: "Tag3" },
        { id: 3, name: "Other" },
    ];

    beforeEach(() => {
        fakeTagService = jasmine.createSpyObj(["getTags", "createTag"]);

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([TagState])],
            providers: [
                { provide: TagService, useValue: fakeTagService }
            ]
        });

        store = TestBed.inject(Store);

        store.reset({
            ...store.snapshot(),
            tagsState: {
                tags: [],
                filteredTags: []
            }
        });
    });

    // selectors
    it('Select state', () => {
        const state: TagStateModel = store.selectSnapshot(TagState);
        expect(state).toBeTruthy();
    });

    it('Select filteredTags', () => {
        const state: TagStateModel = store.selectSnapshot(TagState);
        expect(state.filteredTags).toEqual([]);
    });

    it('Select tags', () => {
        const state: TagStateModel = store.selectSnapshot(TagState);
        expect(state.tags).toEqual([]);
    });

    // Actions
    it('Action GetTagsAction', () => {
        fakeTagService.getTags.and.returnValue(of(tagList));

        store.dispatch(new GetTagsAction());


        const tags: ITag[] = store.selectSnapshot(TagState.tags);

        expect(tags).toEqual(tagList);
    });

    it('Action FilterTagListAction 1 result', () => {
        const state: TagStateModel = store.selectSnapshot(TagState);
        state.tags = tagList;

        let filter: string = "er";
        let expectedResult: string[] = ["Other"];

        store.dispatch(new FilterTagListAction(filter));

        let result: string[] = store.selectSnapshot(TagState.filteredTags);

        expect(result).toEqual(expectedResult);
    });

    it('Action FilterTagListAction several results', () => {
        const state: TagStateModel = store.selectSnapshot(TagState);
        state.tags = tagList;

        let filter: string = "tag";
        let expectedResult: string[] = ["Tag1", "Tag2", "Tag3"];

        store.dispatch(new FilterTagListAction(filter));

        let result: string[] = store.selectSnapshot(TagState.filteredTags);

        expect(result).toEqual(expectedResult);
    });

    it('Action FilterTagListAction no result', () => {
        const state: TagStateModel = store.selectSnapshot(TagState);
        state.tags = tagList;

        let filter: string = "noresult";
        let expectedResult: string[] = [];

        store.dispatch(new FilterTagListAction(filter));

        let result: string[] = store.selectSnapshot(TagState.filteredTags);

        expect(result).toEqual(expectedResult);
    });
});