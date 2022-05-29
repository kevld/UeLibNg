import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TagService } from './tag.service';
import { ITag } from '../models/tag';

describe('TagService', () => {

  let httpTestingController: HttpTestingController;
  let service: TagService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => service = TestBed.inject(TagService));
  beforeEach(() => httpTestingController = TestBed.inject(HttpTestingController));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Create instance', () => {
    expect(service).toBeTruthy();
  });

  it('getTags result', () => {
    const testResult: ITag[] = [
      { id: 1, name: "tag1" },
      { id: 2, name: "tag2" },
    ]


    let tags: ITag[];

    service.getTags().subscribe(x => tags = x);

    const req = httpTestingController.expectOne('https://localhost:7106/api/Tags');
    req.flush(testResult);

    expect(tags).toEqual(testResult);
  });

  it('getTags empty', () => {
    const testResult: ITag[] = []


    let tags: ITag[];

    service.getTags().subscribe(x => tags = x);

    const req = httpTestingController.expectOne('https://localhost:7106/api/Tags');
    req.flush(testResult);

    expect(tags).toEqual(testResult);
  });

  it('createTag', () => {
    let newTag: ITag = { id: 3, name: "tag3" };
    let returnedTag: ITag;

    service.createTag(newTag).subscribe(x => returnedTag = x);

    const req = httpTestingController.expectOne('https://localhost:7106/api/Tags');
    req.flush(newTag);

    expect(returnedTag).toEqual(newTag);
  });
});
