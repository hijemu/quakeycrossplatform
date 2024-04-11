import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Clipboard } from '@capacitor/clipboard';

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
  importedChecklist!: string;

  constructor(
    public navCtrl: NavController,
    private storage: Storage, 
    private alertCtrl: AlertController,
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.loadItems();   
  }

  async createStorage() {
    await this.storage.create(); 
  }

  loadItems() {
    console.log("Loading items...");
    this.storage.get('checklist').then(value => {
      console.log("Retrieved checklist data:", value);
      if (value && value.length > 0) {
        this.checklists = value;
      } else {
        this.checklists = [];
      }
    }).catch(error => {
      console.error("Error loading checklist data:", error);
    });
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
            if (data.checklistitem.trim().length > 12) {
              alert('Exceeded character limit of 12');
            } else if (data.checklistitem.trim() !== '') {
              this.addChecklist(data.checklistitem.trim());
            }
          }
        }
      ]
    }).then(alert => alert.present());
  }
  
  editItem(i: number): void {
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
              if (data.checklistitem.trim().length > 12) {
                alert('Exceeded character limit of 12');
              } else if (data.checklistitem === '') {
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

  updateCheck(i: number): void {
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
  
      if (value[i].foods && value[i].foods.length > 0) {
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
      } else {
        value[i].isChecked = !value[i].isChecked;
      }
  
      this.storage.set('checklist', value);
      this.checklists = value;
    });
  }

  deleteItem(i: number): void {
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      value.splice(i, 1);
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
            if (data.moreItem.trim().length > 14) {
              alert('Exceeded character limit of 14');
            } else if (data.moreItem.trim() !== '') {
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

  editFood(i: number, j: number): void {
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      if (value && value[i]?.foods && value[i].foods[j]) {
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
                if (data.moreItem.trim().length > 12) {
                  alert('Exceeded character limit of 12');
                } else if (data.moreItem.trim() === "") {
                  alert("Please input change");
                } else {
                  value[i].foods[j].name = data.moreItem.trim(); 
                  await this.storage.set('checklist', value);
                  this.checklists = value;
                  alert("Item Updated!");
                }
              }
            }
          ]
        });
        alert1.then(alert => alert.present());
      }
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

  deleteFoodItem(i: number, j: number): void {
    this.storage.get('checklist').then(valueStr => {
      let value = valueStr;
      value[i].foods.splice(j, 1);
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

  async shareChecklist() {
    try {
      const value = await this.storage.get('checklist');
      if (!value || value.length === 0) {
        const alertMessage = 'No checklist to share.';
        const alert = await this.alertCtrl.create({
          header: 'Alert',
          message: alertMessage,
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
  
      const checklistCopy = value.map((checklistItem: any) => {
        const { isChecked, ...rest } = checklistItem;
        const foodItems = checklistItem.foods ? checklistItem.foods.map((foodItem: FoodItem) => ({ name: foodItem.name })) : [];
        return { ...rest, foods: foodItems };
      });
  
      const checklistJson = JSON.stringify(checklistCopy);
  
      const alert = await this.alertCtrl.create({
        header: 'Checklist Content',
        message: checklistJson,
        buttons: [
          {
            text: 'Copy',
            handler: () => {
              this.copyToClipboard(checklistJson);
            }
          },
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
  
      await alert.present();
  
      console.log('Checklist shared successfully.');
    } catch (error) {
      console.error('Error sharing checklist:', error);
    }
  }  
  
  async copyToClipboard(text: string) {
    await Clipboard.write({
      string: text
    });
  }
  
  
  async importChecklist() {
    try {
        const alert = await this.alertCtrl.create({
            header: 'Import Checklist',
            message: 'Paste your checklist JSON here:',
            inputs: [
                {
                    name: 'importedChecklist',
                    type: 'textarea',
                    placeholder: 'Enter checklist JSON'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Import',
                    handler: (data) => {
                        this.handleImportedChecklist(data.importedChecklist);
                    }
                }
            ]
        });
        await alert.present();
    } catch (error) {
        console.error('Error importing checklist:', error);
        const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'An error occurred while importing the checklist.',
            buttons: ['OK']
        });
        await alert.present();
    }
}

async handleImportedChecklist(checklistJson: string) {
    try {
        if (!checklistJson.trim()) {
            const alert = await this.alertCtrl.create({
                header: 'Error',
                message: 'Please paste a valid checklist JSON.',
                buttons: ['OK']
            });
            await alert.present();
            return;
        }

        const sharedChecklist = JSON.parse(checklistJson);

        const confirmAlert = await this.alertCtrl.create({
            header: 'Import Options',
            message: 'Do you want to merge the imported checklist with your existing one or overwrite it?',
            buttons: [
                {
                    text: 'Merge',
                    handler: () => {
                        this.mergeChecklist(sharedChecklist);
                    }
                },
                {
                    text: 'Overwrite',
                    handler: () => {
                        this.overwriteChecklist(sharedChecklist);
                    }
                }
            ]
        });

        await confirmAlert.present();
    } catch (error) {
        console.error('Error importing checklist:', error);
        const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'An error occurred while importing the checklist.',
            buttons: ['OK']
        });
        await alert.present();
    }
}

  async mergeChecklist(sharedChecklist: any[]) {
    try {
      const existingChecklist = await this.storage.get('checklist') || [];
      const mergedChecklist = existingChecklist.concat(sharedChecklist);
      this.checklists = mergedChecklist;
      await this.storage.set('checklist', mergedChecklist);
      const alert = await this.alertCtrl.create({
        header: 'Success',
        message: 'Checklist merged successfully.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error merging checklist:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'An error occurred while merging the checklist.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async overwriteChecklist(sharedChecklist: any[]) {
    try {
      await this.storage.set('checklist', sharedChecklist);
      this.checklists = sharedChecklist;
      const alert = await this.alertCtrl.create({
        header: 'Success',
        message: 'Checklist overwritten successfully.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error overwriting checklist:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'An error occurred while overwriting the checklist.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  
}