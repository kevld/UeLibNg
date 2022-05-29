import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { AssetService } from './asset.service';
import { IAsset } from '../models/asset';
import { AssetType } from '../enums/asset-type.enum';
import { ITag } from 'src/app/tag/models/tag';

describe('AssetService', () => {
    let httpTestingController: HttpTestingController;
    let service: AssetService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        }).compileComponents();
    });

    beforeEach(() => service = TestBed.inject(AssetService));
    beforeEach(() => httpTestingController = TestBed.inject(HttpTestingController));

    afterEach(() => {
        httpTestingController.verify();
    });

    it('Create instance', () => {
        expect(service).toBeTruthy();
    });

    it('getAssets result', () => {
        const tagList1: ITag[] = [
            { id: 1, name: "tag1" },
            { id: 2, name: "tag2" },
        ];

        const tagList2: ITag[] = [
            { id: 2, name: "tag2" },
            { id: 3, name: "tag3" },
        ];

        const testResult: IAsset[] = [
            { id: 1, name: "Asset1", description: "Description 1", assetType: AssetType.Asset, minVersion: 4.10, maxVersion: 4.27, url: "https://github.com/", tags: tagList1 },
            { id: 2, name: "Asset2", description: "Description 2", assetType: AssetType.EnginePugin, minVersion: 4.11, url: "https://github.com/", tags: tagList2 },
            { id: 3, name: "Asset3", description: "Description 3", assetType: AssetType.FullProject, minVersion: 4.12, maxVersion: 5.00, url: "https://github.com/", tags: [] }
        ];

        let assets: IAsset[];

        service.getAssets().subscribe(x => assets = x);

        const req = httpTestingController.expectOne('https://localhost:7106/api/Assets');
        req.flush(testResult);

        expect(assets).toEqual(testResult);
    });

    it('getAssets empty', () => {
        const testResult: IAsset[] = []
        let assets: IAsset[];

        service.getAssets().subscribe(x => assets = x);

        const req = httpTestingController.expectOne('https://localhost:7106/api/Assets');
        req.flush(testResult);

        expect(assets).toEqual(testResult);
    });

    it('createAsset', () => {
        const tagList1: ITag[] = [
            { id: 1, name: "tag1" },
            { id: 2, name: "tag2" },
        ];


        let newAsset: IAsset = { id: 1, name: "Asset1", description: "Description 1", assetType: AssetType.Asset, minVersion: 4.10, maxVersion: 4.27, url: "https://github.com/", tags: tagList1 };
        let returnedAsset: IAsset;

        service.createAsset(newAsset).subscribe(x => returnedAsset = x);

        const req = httpTestingController.expectOne('https://localhost:7106/api/Assets');
        req.flush(newAsset);

        expect(returnedAsset).toEqual(newAsset);
    });

    it('removeAsset', () => {
        const idAsset = 1;
        const expectedResult = '';

        let result;
        service.removeAsset(idAsset).subscribe(x => result = x);

        const req = httpTestingController.expectOne(`https://localhost:7106/api/Assets/${idAsset}`);
        req.flush('', { status: 204, statusText: 'No Data' });
        
        expect(result).toEqual(expectedResult);
    });

});