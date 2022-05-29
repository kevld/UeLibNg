import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { IProject } from '../models/project';
import { IPostRankedAsset, IRankedAsset } from '../models/ranked-asset';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  public getProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>("https://localhost:7106/api/Projects");
  }

  public createProject(project: IProject): Observable<IProject> {
    return this.http.post<IProject>("https://localhost:7106/api/Projects", project)
  }

  public getRankedAssetsForProject(projectId: number): Observable<IRankedAsset[]> {
    return this.http.get<IRankedAsset[]>(`https://localhost:7106/api/RankedAssets/Project/${projectId}`);
  }

  public removeRankedAssetsForProject(id: number): Observable<any> {
    return this.http.delete(`https://localhost:7106/api/RankedAssets/${id}`);
  }

  public addRankedAssetForProject(rankedAssetData: IPostRankedAsset): Observable<any> {
    return this.http.post<IRankedAsset>("https://localhost:7106/api/RankedAssets/", rankedAssetData);
  }
}
