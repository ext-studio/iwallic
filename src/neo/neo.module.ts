import { NgModule } from '@angular/core';
import { RPCService } from './rpc.service';
import { TransactionService } from './transaction.service';
import { UtilService } from './util.service';
import { WalletService } from './wallet.service';

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
