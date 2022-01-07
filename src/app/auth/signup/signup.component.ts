import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignUpComponent implements OnInit, OnDestroy {
    
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

    onSignUp(form: NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email, form.value.password)
    }
    ngOnDestroy() {
        this.authStatusSubscription.unsubscribe()
    }
}