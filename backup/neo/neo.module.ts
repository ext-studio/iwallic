import { NgModule } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { WalletService } from './services/wallet.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        TransactionService, WalletService
    ],
})
export class NEOModule { }
