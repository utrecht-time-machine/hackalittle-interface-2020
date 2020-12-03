import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SourceSelectionComponent } from './source-selection.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SourceSelectionComponent],
  exports: [SourceSelectionComponent],
})
export class SourceSelectionModule {}
