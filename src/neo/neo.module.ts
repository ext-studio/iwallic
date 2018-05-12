import { NgModule } from '@angular/core';
import { RPCService } from './services/rpc.service';
import { TransactionService } from './services/transaction.service';
import { UtilService } from './services/util.service';
import { WalletService } from './services/wallet.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        RPCService, TransactionService,
        UtilService, WalletService
    ],
})
export class NEOModule { }
