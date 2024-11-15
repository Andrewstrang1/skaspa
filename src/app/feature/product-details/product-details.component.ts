import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  productRating: number = 0;
  product: any; // Assume this is populated from a service or input
  userRating: number = 0; // Initialize rating
  reviewText: string = ''; // Initialize review text

  constructor(private router: Router) {}

  // Method to handle rating change from star-rating component
  onRatingChange(newRating: number): void {
    this.userRating = newRating;
    console.log("New Rating:", newRating);
  }

  submitReview(): void {
    console.log('Submitting Review:', this.reviewText);
    console.log('Selected Rating:', this.userRating);

    const reviewData = {
      productId: this.product?.ProductID,
      rating: this.userRating,
      review: this.reviewText
    };

    // Call a service to submit reviewData, for example:
    // this.reviewService.submitReview(reviewData).subscribe(...);
  }

  // Navigate back to the product list
  goBack() {
    this.router.navigate(['../api-integration']); // Adjust to your routing path
  }
}
