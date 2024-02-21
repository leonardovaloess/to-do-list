import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { IListItems } from '../../interface/IListItems.interface';
import { JsonPipe } from '@angular/common';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { ELocalStorage } from '../../enum/ELocalStorage.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent,JsonPipe, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem = signal(true)

  #setListItems = signal<IListItems[]>(this.#parseItems())
  public getListItems = this.#setListItems.asReadonly()


  #parseItems(){
    return JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST) || '[]')
  }


  #updateLocalStorage(){
    return localStorage.setItem(ELocalStorage.MY_LIST, JSON.stringify(this.#setListItems))
  }
  public getInputAndAddItem(value:IListItems){
    localStorage.setItem(
      ELocalStorage.MY_LIST,JSON.stringify([...this.#setListItems(), value])
    )

    return this.#setListItems.set(this.#parseItems())
  }

  public listItemsStage(value: 'pending' | 'completed') {
    return this.getListItems().filter((res:IListItems) => {
      if(value === 'pending'){
        return !res.checked
      }
      if(value === 'completed'){
        return res.checked
      }

      return res
    })
  }

  public updateItemCheckbox(newItem: {id:string, checked:boolean}){
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter(res => {
        if(res.id === newItem.id){
          res.checked = newItem.checked
          return res
        }

        return res
      })
      return oldValue
    })

    return this.#updateLocalStorage()

  }
  public deleteAllItems(){
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim! delete tudo"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalStorage.MY_LIST)
        return this.#setListItems.set(this.#parseItems())
      }
    });
  }
  

  public updateItemText(newItem: {value: string, id:string}){
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter(res => {
        if(res.id === newItem.id){
          res.value = newItem.value
          return res
        }

        return res
      })
      return oldValue
    })

    return this.#updateLocalStorage()

  }

  
  public deleteItem(id:string){
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim! delete o item"
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue:IListItems[])=>{
          return oldValue.filter((res) => res.id !== id)
        })
    
        return this.#updateLocalStorage()
      }
    });



    


  }
}
