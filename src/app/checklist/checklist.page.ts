import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

interface FoodItem {
  name: string;
  isChecked: boolean;
}

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
                                                                                                                                            
  checklists: any;
  foodcheckcount = 0;

  constructor(
    public navCtrl: NavController,
    private storage: Storage, 
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.loadItems();   
  }

  async createStorage() {
    await this.storage.create(); 
  }

  loadItems() {
    this.storage.get('checklist').then(valueStr => {
      if (valueStr && valueStr.length > 0 && valueStr[0].foods) {
        this.checklists = valueStr;
        for (let counter = 0; counter < this.checklists[0].foods.length; counter++) {
          if (this.checklists[0].foods[counter].isChecked) {
            this.foodcheckcount++;
          }
        }
      } else {
        this.checklists = [];
      }
    });
  }
  
  checklistClicked(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const threshold = 30;
    const editButton = target.closest('.edit-button');
    const checkbox = target.closest('ion-checkbox');
    if (checkbox && Math.abs(checkbox.getBoundingClientRect().left - event.clientX) < threshold) {
      event.stopPropagation();
    }
    if (editButton) {
      event.stopPropagation();
    }
  }

  
  

  updateCheck(i: number): void {
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      if (i == 0) {
        if (value[i].isChecked) {
          value[i].isChecked = false;
          for (let count = 0; count < value[0].foods.length; count++) {
            value[0].foods[count].isChecked = false;
            this.foodcheckcount = 0;
          }
        } else {
          value[i].isChecked = true;
          for (let count = 0; count < value[0].foods.length; count++) {
            value[0].foods[count].isChecked = true;
            this.foodcheckcount = value[0].foods.length;
          }
        }
      } else {
        value[i].isChecked = !value[i].isChecked;
      
        for (let j = 0; j < value[i].foods.length; j++) {
          value[i].foods[j].isChecked = value[i].isChecked;
        }
      }
      this.storage.set('checklist', value);
      this.checklists = value;
    });
  }
  


  addItem() {
    this.alertCtrl.create({
      header: 'Add Checklist',
      inputs: [
        {
          name: 'checklistitem',
          type: 'text',
          placeholder: 'Enter checklist item'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (data.checklistitem.trim() !== '') {
              this.addChecklist(data.checklistitem.trim());
            }
          }
        }
      ]
    }).then(alert => alert.present());
  }
  

  addChecklist(checklistitem: string): void {
    const newItem = { val: checklistitem, isChecked: false };
  
    if (!this.checklists) {
      this.checklists = [newItem];
    } else {
      this.checklists.push(newItem);
    }
  
    this.storage.set('checklist', this.checklists).then(() => {
      console.log('Item Added!');
    }).catch((error) => {
      console.error('Error adding item: ', error);
    });
  }

  addFood(index: number): void {
    this.alertCtrl.create({
      header: 'Add item',
      inputs: [
        {
          name: 'moreItem',
          type: 'text',
          placeholder: 'Enter more item'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (data.moreItem.trim() !== '') {
              this.addFoodSubmit(index, data.moreItem.trim());
            }
          }
        }
      ]
    }).then(alert => alert.present());
  }
  
  

  async addFoodSubmit(index: number, moreItem: string): Promise<void> {
    try {
      if (!moreItem.trim()) {
        return;
      }
  
      const value = await this.storage.get('checklist') || [];
  
      if (!value[index].foods) {
        value[index].foods = [];
      }
  
      value[index].foods.push({ name: moreItem.trim(), isChecked: false });
  
      await this.storage.set('checklist', value);
      this.checklists = value;
  
      
    } catch (error) {
      console.error(error);
    }
  }
  

  updateFoodCheck(i: number, j: number): void {
    this.storage.get('checklist').then((valueStr: any[]) => {
      let value = valueStr;
      if (value[i].foods[j].isChecked) {
        value[i].foods[j].isChecked = false;
        value[i].isChecked = false;
        this.foodcheckcount--;
      } else {
        value[i].foods[j].isChecked = true;
        this.foodcheckcount++;
        if (this.foodcheckcount === value[i].foods.length) {
          value[i].isChecked = true;
        }
      }

      const allFoodsChecked = value[i].foods.every((food: FoodItem) => food.isChecked);
      value[i].isChecked = allFoodsChecked;

      this.storage.set('checklist', value);
      this.checklists = value;
    });
  }

  deleteFoodConfirm(i: number, j: number): void {
    let alert = this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteFoodItem(i, j);
          }
        }
      ]
    });
    alert.then(alert => alert.present());
  }
  
  

  deleteFoodItem(i: number, j: number): void {
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      value[i].foods.splice(j, 1);
      this.storage.set('checklist', value);
      this.checklists = value;
    });
  }

  deleteConfirm(i: number): void {
    let alert = this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this checklist?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteItem(i);
          }
        }
      ]
    });
    alert.then(alert => alert.present());
  }

  deleteItem(i: number): void {
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      value.splice(i, 1);
      this.storage.set('checklist', value);
      this.checklists = value;
    });
  }

  editItem(event: MouseEvent, i: number): void {
    event.stopPropagation();
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      let alert1 = this.alertCtrl.create({
        header: 'Edit Checklist Item',
        inputs: [
          {
            name: 'checklistitem',
            value: value[i].val
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Update',
            handler: (data) => {
              if (data.checklistitem === '') {
                alert('Please input an item');
              } else {
                this.editItemSubmit(i, data.checklistitem);
              }
            }
          }
        ]
      });
      alert1.then(alert => alert.present());
    });
  }

  editItemSubmit(i: number, checklistitem: string): void {
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      value[i].val = checklistitem;
      this.storage.set('checklist', value);
      this.checklists = value;
      alert('Item Updated!');
    });
  }

  editFood(event: MouseEvent, i: number, j: number): void {
    event.stopPropagation(); 
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      const alert1 = this.alertCtrl.create({
        header: 'Edit Item',
        inputs: [
          {
            name: 'moreItem',
            value: value[i].foods[j].name
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Update',
            handler: async (data) => {
              if (data.fooditem === "") {
                alert("Please input change");
              } else {
                await this.editFoodSubmit(i, j, data.fooditem);
              }
            }
          }
        ]
      });
      alert1.then(alert => alert.present());
    });
  }

  async editFoodSubmit(i: number, j: number, fooditem: string): Promise<void> {
    try {
      const valueStr = await this.storage.get('checklist');
      let value = valueStr;

      value[i].foods[j].name = fooditem;

      await this.storage.set('checklist', value);
      this.checklists = value;
    
      alert("Item Updated!");
    } catch (error) {
      console.error(error);
    }
  }
  
}