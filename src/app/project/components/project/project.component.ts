import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddRankedAssetToProjectAction, ChangeActiveProjectAction, CreateProjectAction, GetProjectsAction, InitDraftProjectAction, LoadRankedAssetAction, LockAddButtonAction, OpenDraftProjectTabAction, RemoveRankedAssetFromProjectAction, UnlockAddButtonAction } from '../../actions/project.action';
import { IProject } from '../../models/project';
import { IRankedAsset } from '../../models/ranked-asset';
import { ProjectState } from '../../states/project.state';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

    @Select(ProjectState.projects)
    projects$: Observable<IProject[]>;

    @Select(ProjectState.draftProject)
    draftProject$: Observable<IProject>;
    
    @Select(ProjectState.lockAddButton)
    lockAddButton$: Observable<boolean>;

    @Select(ProjectState.lockAddButton)
    openDraftTab$: Observable<boolean>;

    @Select(ProjectState.activeTab)
    activeTab$: Observable<number | string>;

    @Select(ProjectState.rankedAssetsForProject)
    rankedAssetsForProject$: Observable<IRankedAsset[]>;

    projectForm: FormGroup;

    active: any;

    constructor(private store: Store, private form: FormBuilder) {
        
    }

    ngOnInit(): void {
        this.store.dispatch(new GetProjectsAction());

        this.projectForm = this.form.group({
            title: [''],
            description: ['']
        });


        this.activeTab$.subscribe(x => this.active = x);
    }

    createDraftProject(): void {
        this.store.dispatch(new InitDraftProjectAction());

        this.projectForm.reset();
        this.store.dispatch(new LockAddButtonAction());
        this.store.dispatch(new OpenDraftProjectTabAction());

        this.active = 'draftProject';

    }

    closeDraftProject(): void {
        this.store.dispatch(new InitDraftProjectAction());
        this.store.dispatch(new UnlockAddButtonAction());
    }

    onSubmit() {
        let name = this.projectForm.get('title').value as string;
        let description = this.projectForm.get('description').value as string;
        this.store.dispatch(new CreateProjectAction(name, description));

    }

    loadAssets(projectId: number): void {
        this.store.dispatch(new LoadRankedAssetAction(projectId));

    }

    changeActiveProject(projectId: number) {
        this.store.dispatch(new ChangeActiveProjectAction(projectId))
    }

    removeRankedAssetFromProject(rankedAssetId?: number) {
        if (rankedAssetId)
            this.store.dispatch(new RemoveRankedAssetFromProjectAction(rankedAssetId));
    }

    addRankedAssetToProject(assetId: number, rank: number) {
        this.store.dispatch(new AddRankedAssetToProjectAction(assetId, rank));
    }
}
