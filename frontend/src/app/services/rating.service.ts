import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductRatingStats {
    averageRating: number;
    ratingCount: number;
}

export interface UserRating {
    id?: number;
    productId: number;
    userId: number;
    rating: number;
}

@Injectable({
    providedIn: 'root'
})
export class RatingService {
    private apiUrl = `${environment.apiUrl}/ratings`;

    constructor(private http: HttpClient) { }

    rateProduct(productId: number, rating: number): Observable<UserRating> {
        return this.http.post<UserRating>(this.apiUrl, { productId, rating });
    }

    getProductRating(productId: number): Observable<ProductRatingStats> {
        return this.http.get<ProductRatingStats>(`${this.apiUrl}/product/${productId}`);
    }

    getUserRating(productId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/product/${productId}/user`);
    }
}
