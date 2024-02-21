import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  viewChild,
} from '@angular/core';
import { IListItems } from '../../interface/IListItems.interface';
import { CommonModule, JsonPipe } from '@angular/common';
import { InputListItemComponent } from '../input-list-item/input-list-item.component';

@Component({
  selector: 'app-input-add-item',
  standalone: true,
  imports: [CommonModule, JsonPipe, InputListItemComponent],
  templateUrl: './input-add-item.component.html',
  styleUrl: './input-add-item.component.scss',
})
export class InputAddItemComponent {
  #cdr = inject(ChangeDetectorRef);

  @ViewChild('inputText') public inputText!: ElementRef;

  @Input({ required: true }) public inputListItens: IListItems[] = [];

  @Output() public outputListItens = new EventEmitter<IListItems>();
  public focusAndAddItem(value: string) {
    if (value) {
      this.#cdr.detectChanges();
      this.inputText.nativeElement.value = '';

      const dataAtual = new Date();
      const timestamp = dataAtual.getTime();
      const id = `ID ${timestamp}`;
      this.outputListItens.emit({
        id,
        checked: false,
        value,
      });

      console.log({
        id,
        checked: false,
        value,
      });

      return this.inputText.nativeElement.focus();
    }
  }
}
