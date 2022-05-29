import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxsModule, Store } from '@ngxs/store';
import { interval, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITag } from 'src/app/tag/models/tag';
import { TagService } from 'src/app/tag/services/tag.service';
import { TagState, TagStateModel } from 'src/app/tag/states/tag.state';
import { AssetType } from '../../enums/asset-type.enum';
import { IAsset } from '../../models/asset';
import { AssetService } from '../../services/asset.service';
import { AssetState } from '../../states/asset.state';
import { take } from 'rxjs/operators';
import { AssetComponent } from './asset.component';

describe('AssetComponent', () => {
    let component: AssetComponent;
    let fixture: ComponentFixture<AssetComponent>;

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

    beforeEach(async () => {

        fakeAssetService = jasmine.createSpyObj(["getAssets", "createAsset", "removeAsset"]);
        fakeTagService = jasmine.createSpyObj(["getTags", "createTag"]);

        TestBed.configureTestingModule({
            declarations: [AssetComponent],
            imports: [NgxsModule.forRoot([AssetState, TagState])],
            providers: [
                { provide: AssetService, useValue: fakeAssetService },
                { provide: TagService, useValue: fakeTagService },
                FormBuilder
            ]
        });

        await TestBed.compileComponents().then(async () => {
            fixture = TestBed.createComponent(AssetComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            store = TestBed.get(Store);
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
    });

    afterEach(() => {
        document.body.removeChild(fixture.nativeElement);
    });

    it('should create', () => {
        fakeAssetService.getAssets.and.returnValue(of(assetList));


        expect(component).toBeTruthy();
    });

    it('openAssetForm', () => {
        component.openAssetForm();
        expect(component).toBeTruthy();
    });

    it('cancelAssetForm', () => {
        component.cancelAssetForm();
        expect(component).toBeTruthy();
    });

    it('addNewTag', () => {
        component.addNewTag();
        expect(component).toBeTruthy();
    });

    it('removeAsset', () => {
        component.removeAsset(1);
        expect(component).toBeTruthy();
    });

    it('onSubmit', () => {
        component.onSubmit();
        expect(component).toBeTruthy();
    });

    it('removeTagFromAsset', () => {
        component.removeTagFromAsset("Tag1");
        expect(component).toBeTruthy();
    });

    it('getAssetType', () => {
        const enumVal = component.getAssetType(1);
        expect(enumVal).toEqual("Asset");
    });

    it('addExistingTag', () => {
        component.addExistingTag({ value: "Tag1" });
        expect(component).toBeTruthy();
    });

    it('formatter', () => {
        const result = component.formatter("tag1");
        expect(result).toEqual("TAG1");
    });

    it('search', fakeAsync(() => {
        const tagState:TagStateModel = store.selectSnapshot(TagState);
        tagState.tags = tagList1;

        component.openAssetForm();
        fixture.detectChanges();

        let inputTextArray = ['t', 'ta', 'tag', 'g1'];
        let text$ : Observable<string> = interval(250).pipe(take(5),map((index: number) => inputTextArray[index]));
        component.search(text$).subscribe(x => 
            {
            });
        tick(2500)

        expect(component).toBeTruthy();
    }));
});
