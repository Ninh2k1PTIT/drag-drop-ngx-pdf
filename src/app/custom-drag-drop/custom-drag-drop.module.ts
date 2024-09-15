import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorComponent } from './generator/generator.component';
import { ItemComponent } from './item/item.component';
import { CustomDragDropComponent } from './custom-drag-drop.component';

@NgModule({
  declarations: [GeneratorComponent, ItemComponent, CustomDragDropComponent],
  imports: [CommonModule],
  exports: [CustomDragDropComponent],
})
export class CustomDragDropModule {}
