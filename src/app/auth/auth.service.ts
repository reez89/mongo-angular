import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: any;
    private userId: string;

    getToken(){
        return this.token;
    }

    getIsAuth(): boolean{
        return this.isAuthenticated;
    }

    getUserId(): string{
        return this.userId;
    }

    getAuthStatusListener(): Subject<boolean>{
        return this.authStatusListener;
    }
    constructor(private http: HttpClient, private router: Router){}
    
    createUser(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password
        }
        this.http
            .post("http://localhost:4000/api/user/signup", authData)
            .subscribe({
                    next:  () => 
                        this.router.navigate(['/']), 
                    error: (error) =>
                        this.getAuthStatusListener().next(false)
            })
    }

    login(email: string, password: string){
        const authData: AuthData = {
            email: email,
            password: password
        }
        this.http
            .post<{token: string, expiresIn: number, userId: string}>("http://localhost:4000/api/user/login", authData)
            .subscribe({
                next : (response) => {
                    const token = response.token;
                    this.token = token;
                    if(token){
                        const expiresInDuration = response.expiresIn;
                        this.setAuthTimer(expiresInDuration)
                        this.isAuthenticated = true;
                        this.userId = response.userId;
                        this.authStatusListener.next(true);
                        const dateNow = new Date();
                        const expirationDate = new Date(
                            dateNow.getTime() + (expiresInDuration * 1000));
                            console.log(expirationDate)
                        this.saveAuthData(token,expirationDate, this.userId)
                        this.router.navigate(['/']);
                    }
                }, 
                error: () => {
                    this.getAuthStatusListener().next(false)
                }
            })
    }

    autoAuthUser(){
       const userInfo =  this.getAuthData();
       if( !userInfo ){
           return;
       }
       const currentDate = new Date();
       const expiresIn = 
        userInfo.expirationDate.getTime() - currentDate.getTime()
       if(expiresIn > 0){
            this.token = userInfo.token;
            this.isAuthenticated = true;
            this.userId = userInfo.userId
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
       }
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string ){
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.setItem('userId', this.userId);

    }

    private getAuthData(){
        const token =  localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expirationDate');
        const userId = localStorage.getItem('userId');  
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token ,
            expirationDate : new Date(expirationDate),
            userId : userId
        }
    }

    private setAuthTimer(duration: number){
       this.tokenTimer = setTimeout(() =>{
            this.logout()
        }, duration * 1000)
    }
}