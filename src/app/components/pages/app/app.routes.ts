import { Routes } from '@angular/router';
import { CLogin } from '../c-login/c-login';
import { CNotFound } from '../c-not-found/c-not-found';
import { CProducts } from '../c-products/c-products';
import { CResgister } from '../c-register/c-resgister';
import { CLandingpage } from '../c-landingpage/c-landingpage';
import { CProductInfoComponent } from '../c-product-info/c-product-info';

export const routes: Routes = [
    { path: '', component: CLandingpage },
    { path: 'login', component: CLogin },
    { path: 'register', component: CResgister },
    { path: 'main', component: CLandingpage },
    { path: 'products', component: CProducts },
    { path: 'producto/:id', component: CProductInfoComponent },
    { path: '**', component: CNotFound }
];
