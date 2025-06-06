import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private http = inject(HttpClient);

  uploadImage(formData: FormData): Observable<{ imagePath: string }> {
    return this.http.post<{ imagePath: string }>(
      `${environment.apiUrl}/images`,
      formData
    );
  }
}
