import { Component, OnInit } from '@angular/core';
import { NutritionService } from '../services/nutrition.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  query: string = '';
  nutritionData: any;
  date: string = ''; // Define the date property
  savedDates: string[] = []; // Array to store saved dates

  constructor(private nutritionService: NutritionService, private databaseService: DatabaseService) { }

  ngOnInit() {
    this.loadSavedDates();
  }

  getNutrition() {
    if (!this.query.trim()) {
      console.error('Query cannot be empty');
      return;
    }

    console.log('Fetching nutrition data for query:', this.query);

    this.nutritionService.getNutrition(this.query).subscribe(
      data => {
        console.log('Data received:', data);
        this.nutritionData = data.items;
      },
      error => {
        console.error('Error fetching nutrition data:', error);
      }
    );
  }

  saveData() {
    if (this.date && this.nutritionData) {
      this.databaseService.saveNutritionData(this.date, this.nutritionData).then(() => {
        this.loadSavedDates(); // Refresh the list of saved dates
        this.loadData(); // Refresh the nutrition data
      });
    }
  }

  loadData() {
    if (this.date) {
      this.databaseService.getNutritionData(this.date).then(data => {
        this.nutritionData = data;
      });
    }
  }

  deleteData() {
    if (this.date) {
      this.databaseService.deleteNutritionData(this.date).then(() => {
        this.nutritionData = null;
        this.loadSavedDates(); // Refresh the list of saved dates
        this.loadData(); // Clear the nutrition data
      });
    }
  }

  deleteDate(date: string) {
    this.databaseService.deleteNutritionData(date).then(() => {
      this.loadSavedDates(); // Refresh the list of saved dates
    });
  }

  loadSavedDates() {
    this.databaseService.getAllSavedDates().then(dates => {
      this.savedDates = dates;
    });
  }

  getTotal(nutrient: string): number {
    if (!this.nutritionData) return 0;
    return Math.round(this.nutritionData.reduce((total: any, item: { [x: string]: any; }) => total + item[nutrient], 0));
  }
}
