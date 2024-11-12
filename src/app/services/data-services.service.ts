import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DataServicesService {
  constructor() { }

  getSampleData() {
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      status: ['Active', 'Pending', 'Inactive'][i % 3],
      selected: false, 
      rating: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5][i % 11],
      reviewCount: [100, 200, 300, 400] [i % 4]
    }));
  }

  putSampleData(dummyBody: string) {
    console.log ('Response from Data Service: ', dummyBody)

  }

  
}