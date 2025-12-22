import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lens, LensCoating } from '../models/lens.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LensService {

  private apiUrl = environment.apiUrl + '/lenses';

  constructor(private http: HttpClient) { }

  getAllLenses(): Observable<Lens[]> {
    return this.http.get<Lens[]>(this.apiUrl);
  }

  getAllCoatings(): Observable<LensCoating[]> {
    return this.http.get<LensCoating[]>(`${this.apiUrl}/coatings`);
  }
}
