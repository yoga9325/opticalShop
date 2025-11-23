import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Advertisement {
    id?: number;
    imageUrl: string;
    caption: string;
    active?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AdvertisementService {
    private apiUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    getAllActiveAdvertisements(): Observable<Advertisement[]> {
        return this.http.get<Advertisement[]>(`${this.apiUrl}/advertisements`);
    }

    getAllAdvertisements(): Observable<Advertisement[]> {
        return this.http.get<Advertisement[]>(`${this.apiUrl}/admin/advertisements`);
    }

    addAdvertisement(advertisement: Advertisement): Observable<Advertisement> {
        return this.http.post<Advertisement>(`${this.apiUrl}/admin/advertisements`, advertisement);
    }

    deleteAdvertisement(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/admin/advertisements/${id}`);
    }
}
