import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  public goToHome(): void {
    void this.router.navigate(['']);
  }

  public goToLogin(): void {
    void this.router.navigate(['/logIn']);
  }

  public goToProducts(): void {
    void this.router.navigate(['/products']);
  }

  public goToRegister(): void {
    void this.router.navigate([`/register`]);
  }

  public goToAdmin(): void {
    void this.router.navigate(['/admin']);
  }
}
