import {Component} from '@angular/core';
import {NgIf, NgStyle} from '@angular/common';
import {IconDirective} from '@coreui/icons-angular';
import {
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardGroupComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TextColorDirective
} from '@coreui/angular';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ApiService} from '../../../../services/api.service';
import {LoginResponse} from "../../../../models/login-response.model";
import {ProfileResponse} from "../../../../models/profile-response.model";
import {HttpCoreInterceptor} from "../../../../http-core.interceptor";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [HttpClientModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, ReactiveFormsModule, RouterLink, AlertComponent, NgIf],
    providers: [
        ApiService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpCoreInterceptor,
            multi: true
        }
        ]
})
export class LoginComponent {
    loginForm: FormGroup;
    loginError: string | null = null;

    constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.checkAuthentication();
    }

    checkAuthentication(): void {
        const token = this.apiService.getToken();
        if (token) {
            this.router.navigate(['/dashboard']);
        }
    }

    async login(): Promise<void> {
        if (this.loginForm.valid) {
            const userName = this.loginForm.get('username')?.value;
            const password = this.loginForm.get('password')?.value;

            try {
                console.log('Login request payload:', { userName, password });

                const response = await firstValueFrom(this.apiService.login({ userName, password })) as LoginResponse;

                console.log('Login response:', response);

                const accessToken = response.payload.accessToken;
                this.apiService.saveToken(accessToken);

                console.log('Getting profile with token:', accessToken, 'and userID:', response.payload.userID);

                const profileResponse = await firstValueFrom(this.apiService.getProfile(accessToken, response.payload.userID)) as ProfileResponse;

                console.log('Profile response:', profileResponse);

                const userType = profileResponse.payload.user.userType;

                if (userType === 'ENGINEER' || userType === 'SYSOP') {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.loginError = 'Bu kullanıcı tipi için erişim izni yok.';
                    this.autoDismissAlert();
                }
            } catch (error) {
                console.error('An error occurred during login or profile retrieval:', error);
                this.loginError = 'Bir hata oluştu. Lütfen tekrar deneyin.';
                this.autoDismissAlert();
            }
        }
    }

    autoDismissAlert(): void {
        setTimeout(() => {
            this.loginError = null;
        }, 2000); // 2 saniye sonra alert kaybolacak
    }
}
