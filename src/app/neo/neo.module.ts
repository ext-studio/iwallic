import { NgModule } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { WalletService } from './services/wallet.service';
import { WalletGuard } from './services/wallet.guard';
import { NoWalletGuard } from './services/no-wallet.guard';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        TransactionService, WalletService, WalletGuard,
        NoWalletGuard
    ],
})
export class NEOModule { }
