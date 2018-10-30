import { NgModule } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { WalletService } from './services/wallet.service';
import { BlockService } from './services/block.service';
import { WalletGuard } from './services/wallet.guard';
import { NoWalletGuard } from './services/no-wallet.guard';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        TransactionService, WalletService, WalletGuard,
        NoWalletGuard, BlockService
    ],
})
export class NEOModule { }
