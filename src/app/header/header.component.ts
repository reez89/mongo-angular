import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuth = false;
  private authListenerSubs: Subscription;
  constructor(private auth: AuthService){}

  ngOnInit() {
    this.userIsAuth = this.auth.getIsAuth();
   this.authListenerSubs = 
    this.auth.getAuthStatusListener().subscribe(isAuth =>{
      this.userIsAuth = isAuth;
    })
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout(){
    this.auth.logout();
  }

}
