import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./signup/signup.component";

@NgModule({
    declarations: [
        LoginComponent,
        SignUpComponent,
    ],
    
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule,
        AuthRoutingModule
    ]
})
export class AuthModule{}