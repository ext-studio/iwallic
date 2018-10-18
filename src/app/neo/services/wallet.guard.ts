import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WalletService } from './wallet.service';

@Injectable()
export class WalletGuard implements CanActivate {
    constructor(
        private wallet: WalletService
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.wallet.init().pipe(map((res) => {
            return !!res;
        }), catchError(() => of(false)));
    }
}
