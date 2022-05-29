import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { Store, NgxsModule } from "@ngxs/store";
import { of } from "rxjs";
import { IProject } from "../../models/project";
import { IRankedAsset } from "../../models/ranked-asset";
import { ProjectService } from "../../services/project.service";
import { ProjectState } from "../../states/project.state";
import { ProjectComponent } from "./project.component";


describe('ProjectComponent', () => {
    let component: ProjectComponent;
    let fixture: ComponentFixture<ProjectComponent>;

    let store: Store;



    let fakeProjectService: any;

    beforeEach(async () => {

        fakeProjectService = jasmine.createSpyObj(["getProjects", "createProject", "getRankedAssetsForProject", "removeRankedAssetsForProject", "addRankedAssetForProject"]);

        TestBed.configureTestingModule({
            declarations: [ProjectComponent],
            imports: [NgxsModule.forRoot([ProjectState]), NgbNavModule],
            providers: [
                { provide: ProjectService, useValue: fakeProjectService },
                FormBuilder
            ]
        });

        await TestBed.compileComponents().then(async () => {
            fixture = TestBed.createComponent(ProjectComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            store = TestBed.get(Store);
            store.reset({
                ...store.snapshot(),
                projectssState: {
                    projects: [],
                    draftProject: null,
                    lockAddButton: false,
                    openDraftTab: false,
                    rankedAssetsForProject: [],
                    activeTab: 0,
                    activeProject: 0
                },

            });
        });
    });

    afterEach(() => {
        document.body.removeChild(fixture.nativeElement);
    });

    it('should create', () => {
        const fakeRankedAsset: IRankedAsset = { id: 2, assetId: 3, assetName: "Asset3", rank: 8 };
        const projectList: IProject[] = [
            { id: 1, name: "Project1", description: "Desctiprion1", assets: [] },
            { id: 2, name: "Project2", description: "Desctiprion2", assets: [] },
            { id: 3, name: "Project3", description: "Desctiprion3", assets: [] }
        ];

        const rankedAssetForNewProject: IRankedAsset[] = [
            { assetId: 1, assetName: "Asset1", rank: 0 },
            { assetId: 2, assetName: "Asset2", rank: 0 },
            { assetId: 3, assetName: "Asset3", rank: 0 }
        ];
        const newProject: IProject = { id: 3, name: "Project3", description: "Desctiprion3", assets: [] };

        fakeProjectService.getProjects.and.returnValue(of(projectList));
        fakeProjectService.getRankedAssetsForProject.and.returnValue(of(rankedAssetForNewProject));

        expect(component).toBeTruthy();
    });

    it('createDraftProject', () => {
        component.createDraftProject();
        expect(component).toBeTruthy();
    });

    it('closeDraftProject', () => {
        component.closeDraftProject();
        expect(component).toBeTruthy();
    });

    it('onSubmit', () => {
        component.onSubmit();
        expect(component).toBeTruthy();
    });

    it('loadAssets', () => {
        component.loadAssets(1);
        expect(component).toBeTruthy();
    });

    it('changeActiveProject', () => {
        component.changeActiveProject(1);
        expect(component).toBeTruthy();
    });

    it('removeRankedAssetFromProject', () => {
        component.removeRankedAssetFromProject(1);
        expect(component).toBeTruthy();
    });

    it('removeRankedAssetFromProject2', () => {
        component.removeRankedAssetFromProject(null);
        expect(component).toBeTruthy();
    });

    it('addRankedAssetToProject', () => {
        component.addRankedAssetToProject(1, 9);
        expect(component).toBeTruthy();
    });
});
