import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  public getTags(): Observable<ITag[]> {
    return this.http.get<ITag[]>("https://localhost:7106/api/Tags");
  }

  public createTag(tag: ITag): Observable<ITag> {
    return this.http.post<ITag>("https://localhost:7106/api/Tags", tag);
  }
}
