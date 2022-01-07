import { NgModule } from "@angular/core";
import {
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
  } from '@angular/material';

@NgModule({
    exports: [
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatCardModule
    ]
})
export class AngularMaterialModule{}