import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { HttpService } from '../../http-services/http.service';
import { ConfigService } from '../../config/config.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpTestingController: HttpTestingController;
    let httpServiceSpy: jasmine.SpyObj<HttpService>;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    beforeEach(() => {
        const httpServiceMock = jasmine.createSpyObj('HttpService', ['post']);
        const configServiceMock = jasmine.createSpyObj('ConfigService', [
            'getUrlApplication',
        ]);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: HttpService, useValue: httpServiceMock },
                { provide: ConfigService, useValue: configServiceMock },
            ],
        });

        service = TestBed.inject(AuthService);
        httpTestingController = TestBed.inject(HttpTestingController);
        httpServiceSpy = TestBed.inject(
            HttpService
        ) as jasmine.SpyObj<HttpService>;
        configServiceSpy = TestBed.inject(
            ConfigService
        ) as jasmine.SpyObj<ConfigService>;
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    describe('login', () => {
        it('debería retornar éxito con credenciales válidas', (done) => {
            const email = 'test@example.com';
            const password = 'password123';
            const mockResponse = {
                isSuccess: true,
                message: 'Login exitoso',
                data: { token: 'jwt-token' },
            };

            configServiceSpy.getUrlApplication.and.returnValue(
                of('https://api.example.com')
            );
            httpServiceSpy.post.and.returnValue(of(mockResponse));

            service.login(email, password).subscribe((response) => {
                expect(response).toEqual(mockResponse);
                expect(configServiceSpy.getUrlApplication).toHaveBeenCalled();
                expect(httpServiceSpy.post).toHaveBeenCalledWith(
                    'https://api.example.com',
                    'Authentication',
                    null,
                    { email: 'test@example.com', password: 'password123' }
                );
                done();
            });
        });

        it('debería fallar con email inválido', (done) => {
            const email = 'invalid-email';
            const password = 'password123';

            service.login(email, password).subscribe((response) => {
                expect(response.isSuccess).toBeFalse();
                expect(response.message).toContain('Credenciales inválidas');
                done();
            });
        });

        it('debería fallar con contraseña corta', (done) => {
            const email = 'test@example.com';
            const password = 'short';

            service.login(email, password).subscribe((response) => {
                expect(response.isSuccess).toBeFalse();
                expect(response.message).toContain('Credenciales inválidas');
                done();
            });
        });

        it('debería manejar error 429 (Rate Limit)', (done) => {
            const email = 'test@example.com';
            const password = 'password123';
            const mockError = {
                status: 429,
                error: { message: 'Too many requests' },
            };

            configServiceSpy.getUrlApplication.and.returnValue(
                of('https://api.example.com')
            );
            httpServiceSpy.post.and.returnValue(throwError(() => mockError));

            service.login(email, password).subscribe({
                error: (error) => {
                    expect(error.userMessage).toContain('Demasiados intentos');
                    expect(error.isRateLimited).toBeTrue();
                    done();
                },
            });
        });

        it('debería manejar error 401', (done) => {
            const email = 'test@example.com';
            const password = 'password123';
            const mockError = { status: 401 };

            configServiceSpy.getUrlApplication.and.returnValue(
                of('https://api.example.com')
            );
            httpServiceSpy.post.and.returnValue(throwError(() => mockError));

            service.login(email, password).subscribe({
                error: (error) => {
                    expect(error.userMessage).toContain(
                        'Credenciales inválidas'
                    );
                    done();
                },
            });
        });

        it('debería manejar error de conexión', (done) => {
            const email = 'test@example.com';
            const password = 'password123';
            const mockError = { status: 0 };

            configServiceSpy.getUrlApplication.and.returnValue(
                of('https://api.example.com')
            );
            httpServiceSpy.post.and.returnValue(throwError(() => mockError));

            service.login(email, password).subscribe({
                error: (error) => {
                    expect(error.userMessage).toContain('No se pudo conectar');
                    done();
                },
            });
        });
    });

    describe('isLoggedIn', () => {
        it('debería retornar true cuando hay token en localStorage', () => {
            spyOn(localStorage, 'getItem').and.returnValue('auth-token');

            service.isLoggedIn().subscribe((isLogged) => {
                expect(isLogged).toBeTrue();
            });
        });

        it('debería retornar false cuando no hay token en localStorage', () => {
            spyOn(localStorage, 'getItem').and.returnValue(null);

            service.isLoggedIn().subscribe((isLogged) => {
                expect(isLogged).toBeFalse();
            });
        });
    });

    describe('getRateLimitInfo', () => {
        it('debería manejar error 429 (Rate Limit)', (done) => {
            const email = 'test@example.com';
            const password = 'password123';
            const mockError = {
                status: 429,
                error: { message: 'Too many requests' },
            };

            configServiceSpy.getUrlApplication.and.returnValue(
                of('https://api.example.com')
            );
            httpServiceSpy.post.and.returnValue(throwError(() => mockError));

            service.login(email, password).subscribe({
                error: (error) => {
                    expect(error.userMessage).toBe(
                        'Demasiados intentos de inicio de sesión. Por favor, intente más tarde.'
                    );
                    expect(error.isRateLimited).toBeTrue();
                    done();
                },
            });
        });
    });
});
