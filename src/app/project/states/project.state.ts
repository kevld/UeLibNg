import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { AddRankedAssetToProjectAction, ChangeActiveProjectAction, CloseDraftProjectTabAction, CreateProjectAction, GetProjectsAction, InitDraftProjectAction, LoadRankedAssetAction, LockAddButtonAction, OpenDraftProjectTabAction, RemoveRankedAssetFromProjectAction, UnlockAddButtonAction } from "../actions/project.action";
import { IProject } from "../models/project";
import { IPostRankedAsset, IRankedAsset } from "../models/ranked-asset";
import { ProjectService } from "../services/project.service";

export class ProjectStateModel {
    projects: IProject[];
    draftProject: IProject;
    lockAddButton: boolean;
    openDraftTab: boolean;
    rankedAssetsForProject: IRankedAsset[];
    activeTab: number | string;
    activeProject: number;
}

@State<ProjectStateModel>({
    name: 'projectsState',
    defaults: {
        projects: [],
        draftProject: null,
        lockAddButton: false,
        openDraftTab: false,
        rankedAssetsForProject: [],
        activeTab: 0,
        activeProject: 0
    }
})
@Injectable()
export class ProjectState {
    constructor(private service: ProjectService) { }

    @Selector()
    static projects(state: ProjectStateModel) {
        return state.projects;
    }

    @Selector()
    static draftProject(state: ProjectStateModel) {
        return state.draftProject;
    }

    @Selector()
    static lockAddButton(state: ProjectStateModel) {
        return state.lockAddButton;
    }

    @Selector()
    static openDraftTab(state: ProjectStateModel) {
        return state.openDraftTab;
    }

    @Selector()
    static rankedAssetsForProject(state: ProjectStateModel) {
        return state.rankedAssetsForProject;
    }

    @Selector()
    static activeTab(state: ProjectStateModel) {
        return state.activeTab;
    }

    @Selector()
    static activeProject(state: ProjectStateModel) {
        return state.activeProject;
    }

    // @Selector()
    // static activeTab(state: ProjectStateModel) {
    //     return state.activeTab;
    // }

    @Action(GetProjectsAction)
    getProjects(ctx: StateContext<ProjectStateModel>) {
        return this.service.getProjects().pipe(
            tap(x => {
                if(x.length) {
                    ctx.patchState({
                        projects: x,
                        activeProject: x[0].id
                    });
                    ctx.dispatch(new LoadRankedAssetAction(x[0].id));
                }
            })
        );
    }

    @Action(InitDraftProjectAction)
    initDraftProject({ patchState }: StateContext<ProjectStateModel>) {
        patchState({
            draftProject: {
                assets: [],
                description: "",
                name: "",
                id: 0
            }
        })
    }

    @Action(LockAddButtonAction)
    lockAddButton({ patchState }: StateContext<ProjectStateModel>) {
        patchState({
            lockAddButton: true
        })
    }

    @Action(UnlockAddButtonAction)
    unlockAddButton({ patchState }: StateContext<ProjectStateModel>) {
        patchState({
            lockAddButton: false
        })
    }

    @Action(OpenDraftProjectTabAction)
    openDraftProjectTab({ patchState }: StateContext<ProjectStateModel>) {
        patchState({
            openDraftTab: true
        })
    }

    @Action(CloseDraftProjectTabAction)
    closeDraftProjectTab({ patchState }: StateContext<ProjectStateModel>) {
        patchState({
            openDraftTab: false
        })
    }

    @Action(CreateProjectAction)
    createProject(ctx: StateContext<ProjectStateModel>, { name, description }: CreateProjectAction) {

        let project: IProject = {
            id: 0,
            name: name,
            description: description,
            assets: []
        }

        return this.service.createProject(project).pipe(
            tap(x => {
                const state = ctx.getState();

                ctx.patchState({
                    projects: [...state.projects, x],
                    activeTab: state.projects.length
                })

                ctx.dispatch(new LoadRankedAssetAction(x.id));
                ctx.dispatch(new CloseDraftProjectTabAction());
                ctx.dispatch(new UnlockAddButtonAction());
            })
        );
    }

    @Action(LoadRankedAssetAction)
    loadRankedAsset({ patchState }: StateContext<ProjectStateModel>, { projectId }: LoadRankedAssetAction) {
        return this.service.getRankedAssetsForProject(projectId).pipe(
            tap(x => {
                patchState({
                    rankedAssetsForProject: x
                });
            })
        )
    }

    @Action(RemoveRankedAssetFromProjectAction)
    removeRankedAssetFromProject({ getState, patchState }: StateContext<ProjectStateModel>, { id }: RemoveRankedAssetFromProjectAction) {
        return this.service.removeRankedAssetsForProject(id).pipe(
            tap(x => {
                const state = getState();

                const rankedAsset = state.rankedAssetsForProject.filter(x => x.id == id)[0];
                rankedAsset.rank = 0;

                const filteredRankedAssets = state.rankedAssetsForProject.filter(x => x.id != id);
                filteredRankedAssets.push(rankedAsset);

                    patchState({
                        rankedAssetsForProject: filteredRankedAssets
                    })
            })
        );
    }

    @Action(AddRankedAssetToProjectAction)
    addRankedAssetToProject({ getState, patchState }: StateContext<ProjectStateModel>, { assetId, rank }: AddRankedAssetToProjectAction) {
        const state = getState();

        const rankedAssetData: IPostRankedAsset = {
            assetId: assetId,
            projectId: state.activeProject,
            rank: rank
        }

        return this.service.addRankedAssetForProject(rankedAssetData).pipe(
            tap(x => {
                const filteredRankedAssets = state.rankedAssetsForProject.filter(x => x.assetId != rankedAssetData.assetId);

                filteredRankedAssets.unshift(x);

                patchState({
                    rankedAssetsForProject: filteredRankedAssets
                })
            })
        );
    }

    @Action(ChangeActiveProjectAction)
    changeActiveProject({ patchState }: StateContext<ProjectStateModel>, { projectId }: ChangeActiveProjectAction) {
        patchState({
            activeProject: projectId
        })
    }
}
