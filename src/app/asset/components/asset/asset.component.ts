import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { FilterTagListAction, GetTagsAction } from 'src/app/tag/actions/tag.action';
import { ITag } from 'src/app/tag/models/tag';
import { TagState } from 'src/app/tag/states/tag.state';
import { GetAssetsAction, OpenAssetFormAction, CloseAssetFormAction, CreateAssetAction, RemoveTagFromAssetFormAction, AddTagToAssetFormAction, RemoveAssetAction } from '../../actions/asset.action';
import { AssetType } from '../../enums/asset-type.enum';
import { IAsset, IAssetDraft } from '../../models/asset';
import { AssetState } from '../../states/asset.state';

@Component({
    selector: 'app-asset',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {

    @Select(AssetState.isAddingAsset)
    isAddingAsset$: Observable<boolean>;

    @Select(AssetState.assets)
    assets$: Observable<IAsset[]>;

    @Select(AssetState.addedTags)
    addedTags$: Observable<ITag[]>;

    @Select(TagState.tags)
    tags$: Observable<ITag[]>;

    @Select(TagState.filteredTags)
    filteredTagList$: Observable<string[]>;

    form: FormGroup;
    assetTypes: KeyValue<AssetType, string>[];



    constructor(private store: Store, private formBuilder: FormBuilder) {

    }

    formatter = (result: string) => result.toUpperCase();
    searching: boolean;

    search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
        
        return text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap((term) => {
                this.store.dispatch(new FilterTagListAction(term));
                return this.filteredTagList$;
            }),
            tap(() => this.searching = false)
        )}

    ngOnInit(): void {
        this.store.dispatch(new GetAssetsAction());
        this.store.dispatch(new GetTagsAction());

        this.form = this.formBuilder.group({
            name: [''],
            description: [''],
            url: [''],
            minVersion: [''],
            maxVersion: [''],
            assetType: [''],
            tags: [''],
            tagInput: ['']
        });


        this.assetTypes = [
            { key: AssetType.EnginePugin, value: "Engine plugin" },
            { key: AssetType.Asset, value: "Asset" },
            { key: AssetType.FullProject, value: "Full project" },
        ];

    }

    openAssetForm(): void {
        this.form.reset();
        this.store.dispatch(new OpenAssetFormAction());
    }

    cancelAssetForm(): void {
        this.store.dispatch(new CloseAssetFormAction());
    }

    onSubmit(): void {
        let formContent: IAssetDraft = {
            name: this.form.get('name').value,
            description: this.form.get('description').value,
            url: this.form.get('url').value,
            assetType: this.form.get('assetType').value,
            minVersion: this.form.get('minVersion').value,
            maxVersion: this.form.get('maxVersion').value,
        }

        this.store.dispatch(new CreateAssetAction(formContent));
    }

    removeTagFromAsset(tag: string) {
        this.store.dispatch(new RemoveTagFromAssetFormAction(tag));
    }

    addExistingTag(tagInput: any) {
        this.store.dispatch(new AddTagToAssetFormAction(tagInput.value));
        this.form.patchValue({ tagInput: '' });
        tagInput.value = '';
    }

    addNewTag() {
        this.store.dispatch(new AddTagToAssetFormAction(this.form.get('tagInput').value));
        this.form.patchValue({ tagInput: '' });
    }

    removeAsset(id: number) {
        this.store.dispatch(new RemoveAssetAction(id));
    }

    getAssetType(assetType: number): string {
        return this.assetTypes.filter(x => x.key == assetType)[0].value;
    }

}
