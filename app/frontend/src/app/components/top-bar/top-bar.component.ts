import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  constructor(public auth: AuthService, private router: Router) { }
  
  signOut() {
    this.auth.signOut();
    this.router.navigateByUrl("/login");
  }
}

