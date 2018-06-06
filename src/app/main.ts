import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

(navigator as any).splashscreen.show();

platformBrowserDynamic().bootstrapModule(AppModule);
