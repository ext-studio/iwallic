import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { GuideComponent } from './guide/guide.component';

const routes: Routes = [
    // {
    //     path: 'welcome',
    //     component: WelcomeComponent,
    //     children: [
            { path: 'welcome', component: IndexComponent },
            { path: 'welcome/index', component: IndexComponent },
            { path: 'welcome/guide', component: GuideComponent },
            { path: 'welcome/**', component: IndexComponent }
    //     ]
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WelcomeRoutingModule {}
