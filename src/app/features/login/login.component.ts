import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    console.log({ username, password });

    try {
      const res = await this.authService.login(username, password);
      console.log(res);

      // Contoh jika login mengembalikan boolean:
      // if (res === true) { ... }

      // Contoh jika login mengembalikan object dengan token:
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        this.router.navigate(['dashboard']);
      } else if (res.success === true) {
        // Jika login return boolean true, langsung navigate
        this.router.navigate(['dashboard']);
      } else {
        this.errorMessage = 'Login failed: Incorrect username or password.';
      }
    } catch (err: any) {
      this.errorMessage =
        'Login failed: ' + (err.message || 'Please try again later.');
    }
  }
}
