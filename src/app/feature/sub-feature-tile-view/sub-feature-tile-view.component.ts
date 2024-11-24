import { Component, OnInit } from '@angular/core';

interface Tile {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  rating: number;
  reviewCount: number;
}

@Component({
  selector: 'app-sub-feature-tile-view',
  templateUrl: './sub-feature-tile-view.component.html',
  styleUrls: ['./sub-feature-tile-view.component.css']
})

export class SubFeatureTileViewComponent implements OnInit {

  tableData: Tile[] = this.getSampleData();
  displayedColumns = ['id', 'name', 'status'];
  selectable = false; // Enable checkbox column
  showHamburgerMenu = true; // Show row dropdown menu for actions
  showRating = false; //Optional column for product rating 
  selectedTheme = 'purple-theme'; // Default theme
  showTiles = true;

  ngOnInit(): void { }

  getSampleData() {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      description: `Description for Product ${i + 1}`,
      price: (Math.random() * 100).toFixed(2),
      image: `https://via.placeholder.com/250?text=Product+${i + 1}`,
      rating: Math.round((Math.random() * 5) * 2) / 2, // Random rating rounded to nearest 0.5
      reviewCount: Math.floor(Math.random() * 500) + 1,
    }));
    console.table
  }
  

}
