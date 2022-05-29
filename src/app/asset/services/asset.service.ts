import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAsset } from '../models/asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private http: HttpClient) { }

  public getAssets(): Observable<IAsset[]> {
    return this.http.get<IAsset[]>("https://localhost:7106/api/Assets");
  }

  public createAsset(asset: IAsset): Observable<IAsset> {
    return this.http.post<IAsset>("https://localhost:7106/api/Assets", asset);
  }

  public removeAsset(id: number) {
    return this.http.delete(`https://localhost:7106/api/Assets/${id}`);
  }
}
