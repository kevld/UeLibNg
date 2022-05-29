import { TestBed } from "@angular/core/testing";
import { Store, NgxsModule } from "@ngxs/store";
import { of } from "rxjs";
import { GetProjectsAction, CreateProjectAction, InitDraftProjectAction, LockAddButtonAction, UnlockAddButtonAction, OpenDraftProjectTabAction, CloseDraftProjectTabAction, LoadRankedAssetAction, RemoveRankedAssetFromProjectAction, AddRankedAssetToProjectAction, ChangeActiveProjectAction } from "../actions/project.action";
import { IProject } from "../models/project";
import { IRankedAsset } from "../models/ranked-asset";
import { ProjectService } from "../services/project.service";
import { ProjectState, ProjectStateModel } from "./project.state";

describe('AssetState', () => {
    let store: Store;

    let fakeProjectService: any;

    let projectList: IProject[];

    let rankedAssetForNewProject: IRankedAsset[];

    let rankedAssetForExistingProject: IRankedAsset[];

    let draftProject: IProject;

    beforeEach(() => {

        fakeProjectService = jasmine.createSpyObj(["getProjects", "createProject", "getRankedAssetsForProject", "removeRankedAssetsForProject", "addRankedAssetForProject"]);


        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([ProjectState])],
            providers: [
                { provide: ProjectService, useValue: fakeProjectService },
            ]
        });

        store = TestBed.inject(Store);

        store.reset({
            ...store.snapshot(),
            projectsState: {
                projects: [],
                draftProject: null,
                lockAddButton: false,
                openDraftTab: false,
                rankedAssetsForProject: [],
                activeTab: 0,
                activeProject: 0
            }
        });

        projectList = [
            { id: 1, name: "Project1", description: "Desctiprion1", assets: [] },
            { id: 2, name: "Project2", description: "Desctiprion2", assets: [] },
            { id: 3, name: "Project3", description: "Desctiprion3", assets: [] }
        ];

        rankedAssetForNewProject = [
            { assetId: 1, assetName: "Asset1", rank: 0 },
            { assetId: 2, assetName: "Asset2", rank: 0 },
            { assetId: 3, assetName: "Asset3", rank: 0 }
        ];

        rankedAssetForExistingProject = [
            { id: 1, assetId: 1, assetName: "Asset1", rank: 9 },
            { assetId: 2, assetName: "Asset2", rank: 0 },
            { assetId: 3, assetName: "Asset3", rank: 0 }
        ];

        draftProject = {
            assets: [],
            description: "",
            name: "",
            id: 0
        };
    });

    // selectors
    it('Select state', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        expect(state).toBeTruthy();
    });

    it('Select projects', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        expect(state.projects).toEqual([]);
    });

    it('Select draftProject', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        expect(state.draftProject).toEqual(null);
    });

    it('Select lockAddButton', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        expect(state.lockAddButton).toEqual(false);
    });

    it('Select openDraftTab', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        expect(state.openDraftTab).toEqual(false);
    });

    it('Select rankedAssetsForProject', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        expect(state.rankedAssetsForProject).toEqual([]);
    });

    it('Select activeTab', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        expect(state.activeTab).toEqual(0);
    });

    it('Select activeTab n', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        state.activeTab = "test";
        expect(state.activeTab).toEqual("test");
    });

    it('Select activeProject', () => {
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        expect(state.activeProject).toEqual(0);
    });

    // actions
    it('Action GetProjectsAction', async () => {
        fakeProjectService.getProjects.and.returnValue(of(projectList));
        fakeProjectService.getRankedAssetsForProject.and.returnValue(of(rankedAssetForNewProject));

        await store.dispatch(new GetProjectsAction()).toPromise();

        const state: ProjectStateModel =  store.selectSnapshot(ProjectState);
        const projects: IProject[] = state.projects;
        const rankedAssets: IRankedAsset[] = state.rankedAssetsForProject;

        expect(projects).toEqual(projectList);
        expect(rankedAssets).toEqual(rankedAssetForNewProject);
    });

    it('Action GetProjectsAction empty', async () => {
        fakeProjectService.getProjects.and.returnValue(of([]));
        fakeProjectService.getRankedAssetsForProject.and.returnValue(of([]));

        await store.dispatch(new GetProjectsAction()).toPromise();

        const state: ProjectStateModel =  store.selectSnapshot(ProjectState);
        const projects: IProject[] = state.projects;
        const rankedAssets: IRankedAsset[] = state.rankedAssetsForProject;

        expect(projects).toEqual([]);
        expect(rankedAssets).toEqual([]);
    });

    it('Action CreateProjectAction', async () => {
        const newProject: IProject = { id: 3, name: "Project3", description: "Desctiprion3", assets: [] };
        const newProjectName: string = newProject.name;
        const newProjectDescription: string = newProject.description;

        const baseProjectState: ProjectStateModel = store.selectSnapshot(ProjectState);

        baseProjectState.projects = [
            { id: 1, name: "Project1", description: "Desctiprion1", assets: [] },
            { id: 2, name: "Project2", description: "Desctiprion2", assets: [] }
        ];

        fakeProjectService.getProjects.and.returnValue(of(projectList));
        fakeProjectService.createProject.and.returnValue(of(newProject));
        fakeProjectService.getRankedAssetsForProject.and.returnValue(of(rankedAssetForNewProject));

        await store.dispatch(new CreateProjectAction(newProjectName, newProjectDescription)).toPromise();

        // const expectedResult = true;
        const newState: ProjectStateModel = store.selectSnapshot(ProjectState);

        expect(newState.projects).toEqual(projectList);
        expect(newState.activeTab).toEqual(projectList.length - 1);
        expect(newState.openDraftTab).toEqual(false);
        expect(newState.lockAddButton).toEqual(false);
        expect(newState.rankedAssetsForProject).toEqual(rankedAssetForNewProject);

    });

    it('Action InitDraftProjectAction', () => {
        store.dispatch(new InitDraftProjectAction());

        const newDraftProject = store.selectSnapshot(ProjectState.draftProject);

        expect(newDraftProject).toEqual(draftProject);
    });

    it('Action LockAddButtonAction', () => {
        store.dispatch(new LockAddButtonAction());

        const lockAddButton: boolean = store.selectSnapshot(ProjectState.lockAddButton);

        expect(lockAddButton).toEqual(true);
    });

    it('Action UnlockAddButtonAction', () => {
        store.dispatch(new UnlockAddButtonAction());

        const lockAddButton: boolean = store.selectSnapshot(ProjectState.lockAddButton);

        expect(lockAddButton).toEqual(false);
    });

    it('Action OpenDraftProjectTabAction', () => {
        store.dispatch(new OpenDraftProjectTabAction());

        const openDraftTab: boolean = store.selectSnapshot(ProjectState.openDraftTab);

        expect(openDraftTab).toEqual(true);
    });

    it('Action CloseDraftProjectTabAction', () => {
        store.dispatch(new CloseDraftProjectTabAction());

        const openDraftTab: boolean = store.selectSnapshot(ProjectState.openDraftTab);

        expect(openDraftTab).toEqual(false);
    });

    it('Action LoadRankedAssetAction', async () => {
        const projectId: number = 1;

        fakeProjectService.getRankedAssetsForProject.and.returnValue(of(rankedAssetForExistingProject));

        await store.dispatch(new LoadRankedAssetAction(projectId)).toPromise();

        const rankedAssets: IRankedAsset[] = store.selectSnapshot(ProjectState.rankedAssetsForProject);

        expect(rankedAssets).toEqual(rankedAssetForExistingProject);
    });

    it('Action RemoveRankedAssetFromProjectAction', () => {
        const idAssetToRemove: number = 1;
        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        state.rankedAssetsForProject = rankedAssetForExistingProject;

        fakeProjectService.removeRankedAssetsForProject.and.returnValue(of(''));
        store.dispatch(new RemoveRankedAssetFromProjectAction(idAssetToRemove));

        const expectedResult: IRankedAsset[] = [
            { assetId: 2, assetName: "Asset2", rank: 0 },
            { assetId: 3, assetName: "Asset3", rank: 0 },
            { id: 1, assetId: 1, assetName: "Asset1", rank: 0 },
        ];

        const result = store.selectSnapshot(ProjectState.rankedAssetsForProject);

        expect(result).toEqual(expectedResult);
    });

    it('Action AddRankedAssetToProjectAction', () => {
        const idAssetToAdd: number = 3;
        const rank: number = 8;

        const state: ProjectStateModel = store.selectSnapshot(ProjectState);
        state.rankedAssetsForProject = rankedAssetForExistingProject;

        const fakeRankedAsset: IRankedAsset = { id: 2, assetId: 3, assetName: "Asset3", rank: 8 };
        fakeProjectService.addRankedAssetForProject.and.returnValue(of(fakeRankedAsset));

        store.dispatch(new AddRankedAssetToProjectAction(idAssetToAdd, rank));

        const expectedResult: IRankedAsset[] = [
            { id: 2, assetId: 3, assetName: "Asset3", rank: 8 },
            { id: 1, assetId: 1, assetName: "Asset1", rank: 9 },
            { assetId: 2, assetName: "Asset2", rank: 0 },
        ];

        const result = store.selectSnapshot(ProjectState.rankedAssetsForProject);
        expect(result).toEqual(expectedResult);
    });

    it('Action ChangeActiveProjectAction', () => {
        const newIdProject = 2;

        store.dispatch(new ChangeActiveProjectAction(newIdProject));

        const result = store.selectSnapshot(ProjectState.activeProject);

        expect(result).toEqual(newIdProject);
    });
});