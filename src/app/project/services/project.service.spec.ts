import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { AssetType } from 'src/app/asset/enums/asset-type.enum';
import { IAsset } from 'src/app/asset/models/asset';
import { ITag } from 'src/app/tag/models/tag';
import { IProject } from '../models/project';
import { IPostRankedAsset, IRankedAsset } from '../models/ranked-asset';

describe('ProjectService', () => {
    let httpTestingController: HttpTestingController;
    let service: ProjectService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        }).compileComponents();
    });

    beforeEach(() => service = TestBed.inject(ProjectService));
    beforeEach(() => httpTestingController = TestBed.inject(HttpTestingController));

    afterEach(() => {
        httpTestingController.verify();
    });

    it('Create instance', () => {
        expect(service).toBeTruthy();
    });

    it('getProjects result', () => {
        const rankedAssetsList: IRankedAsset[] = [
            { id: 1, assetId: 1, assetName: "Asset1", rank: 9 },
            { assetId: 2, assetName: "Asset2", rank: 0 },
        ];
        const rankedAssetsList2: IRankedAsset[] = [
            { assetId: 1, assetName: "Asset1", rank: 0 },
            { assetId: 2, assetName: "Asset2", rank: 0 },
        ];

        const projectList: IProject[] = [
            { id: 1, name: "Project1", description: "Description1", assets: rankedAssetsList },
            { id: 2, name: "Project2", description: "Description2", assets: rankedAssetsList2 }
        ];



        let projects: IProject[];

        service.getProjects().subscribe(x => projects = x);

        const req = httpTestingController.expectOne('https://localhost:7106/api/Projects');
        req.flush(projectList);

        expect(projects).toEqual(projectList);
    });

    it('getProjects empty', () => {
        const projectList: IProject[] = [];

        let projects: IProject[];

        service.getProjects().subscribe(x => projects = x);

        const req = httpTestingController.expectOne('https://localhost:7106/api/Projects');
        req.flush(projectList);

        expect(projects).toEqual(projectList);
    });

    it('createProjects', () => {
        const project: IProject = { id: 0, name: "Project1", description: "Description1", assets: [] };
        const expectedResult: IProject = { id: 1, name: "Project1", description: "Description1", assets: [] };

        let result: IProject;

        service.createProject(project).subscribe(x => result = x);

        const req = httpTestingController.expectOne('https://localhost:7106/api/Projects');
        req.flush(expectedResult);

        expect(result).toEqual(expectedResult);
    });

    it('getRankedAssetsForProject result', () => {
        const idProject = 1;
        const expectedResult: IRankedAsset[] = [
            { id: 1, assetId: 1, assetName: "Asset1", rank: 9 },
            { assetId: 2, assetName: "Asset2", rank: 0 },
        ];

        let result: IRankedAsset[];

        service.getRankedAssetsForProject(idProject).subscribe(x => result = x);

        const req = httpTestingController.expectOne(`https://localhost:7106/api/RankedAssets/Project/${idProject}`);
        req.flush(expectedResult);

        expect(result).toEqual(expectedResult);
    });

    it('getRankedAssetsForProject empty', () => {
        const idProject = 1;
        const expectedResult: IRankedAsset[] = [];

        let result: IRankedAsset[];

        service.getRankedAssetsForProject(idProject).subscribe(x => result = x);

        const req = httpTestingController.expectOne(`https://localhost:7106/api/RankedAssets/Project/${idProject}`);
        req.flush(expectedResult);

        expect(result).toEqual(expectedResult);
    });

    it('removeRankedAssetsForProject', () => {
        const idRankedAsset = 1;
        const expectedResult = '';

        let result;
        service.removeRankedAssetsForProject(idRankedAsset).subscribe(x => result = x);

        const req = httpTestingController.expectOne(`https://localhost:7106/api/RankedAssets/${idRankedAsset}`);
        req.flush('', { status: 204, statusText: 'No Data' });

        expect(result).toEqual(expectedResult);
    });

    it('addRankedAssetForProject', () => {
        const rankedAssetData: IPostRankedAsset = { assetId: 1, projectId: 1, rank: 9 };
        const expectedResult: IRankedAsset = { id: 1, assetId: 1, assetName: "Asset1", rank: 9 };

        let result: IRankedAsset;
        service.addRankedAssetForProject(rankedAssetData).subscribe(x => result = x);

        const req = httpTestingController.expectOne("https://localhost:7106/api/RankedAssets/");
        req.flush(expectedResult);

        expect(result).toEqual(expectedResult);
    });
})