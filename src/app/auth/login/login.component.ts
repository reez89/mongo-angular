import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy{
    isLoading: boolean = false;
    private authStatusSubscription: Subscription;
    constructor(private authService: AuthService){}

    ngOnInit() {
       this.authStatusSubscription = 
        this.authService.getAuthStatusListener()
            .subscribe(() =>{
                this.isLoading = false
            })
    }
    onLogin(form: NgForm){
        console.log(form.value)
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        this.authService.login(form.value.email, form.value.password);
    }
    ngOnDestroy() {
        this.authStatusSubscription.unsubscribe()
    }
}