import { Routes } from '@angular/router';
import { ChatbotComponent } from './components/chat/chat';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
export const routes: Routes = [

 { path: 'registrarse', component: Register },
 
 { path: 'chat', component: ChatbotComponent },
 { path: '', component: Home },

    
];
