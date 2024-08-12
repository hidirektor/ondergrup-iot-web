import {Component} from '@angular/core';
import {IconDirective} from '@coreui/icons-angular';
import {
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TextColorDirective
} from '@coreui/angular';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {firstValueFrom} from 'rxjs';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../../http-core.interceptor";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [HttpClientModule, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, AlertComponent, ReactiveFormsModule, NgIf],
    providers: [
        ApiService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpCoreInterceptor,
            multi: true
        }
    ]
})
export class RegisterComponent {

    public registerForm: FormGroup;
    public loading: boolean = false;
    public alertMessage: string | null = null;
    public alertColor: string = 'warning';
    public alertVisible: boolean = false;

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            userName: ['', Validators.required],
            nameSurname: ['', Validators.required],
            eMail: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', Validators.required],
            companyName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['', Validators.required],
            userType: ['NORMAL'] // Sabit olarak "NORMAL" değerine ayarlanıyor
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        return form.get('password')?.value === form.get('repeatPassword')?.value ? null : { mismatch: true };
    }

    async onRegister(): Promise<void> {
        if (this.registerForm.invalid) {
            this.showAlert('Please fill in all required fields correctly.', 'danger');
            return;
        }

        const { userName, nameSurname, eMail, phoneNumber, companyName, password } = this.registerForm.value;

        const registerData = {
            userName,
            userType: 'NORMAL',
            nameSurname,
            eMail,
            phoneNumber,
            companyName,
            password
        };

        try {
            this.loading = true;
            await firstValueFrom(this.apiService.register(registerData));
            this.showAlert('Registration successful!', 'success');
            this.router.navigate(['/login']);
        } catch (error) {
            console.error('Registration error:', error);
            this.showAlert('Registration failed. Please try again.', 'danger');
        } finally {
            this.loading = false;
        }
    }

    showAlert(message: string, color: string): void {
        this.alertMessage = message;
        this.alertColor = color;
        this.alertVisible = true;

        setTimeout(() => {
            this.alertVisible = false;
        }, 3000);
    }
}