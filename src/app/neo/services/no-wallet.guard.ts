import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WalletService } from './wallet.service';

@Injectable()
export class NoWalletGuard implements CanActivate {
    constructor(
        private wallet: WalletService,
        private router: Router
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.wallet.init().pipe(map((res) => {
            if (!!res) {
                this.router.navigateByUrl('/asset/list', {replaceUrl: true});
                return false;
            } else {
                return true
            }
        }), catchError(() => of(true)));
    }
}
