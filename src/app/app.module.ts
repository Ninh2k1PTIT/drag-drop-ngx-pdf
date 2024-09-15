import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AppComponent } from './app.component';
import { CustomDragDropModule } from './custom-drag-drop/custom-drag-drop.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CustomDragDropModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
