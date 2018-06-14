import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
if ((navigator as any).splashscreen) {
    (navigator as any).splashscreen.show();
}

platformBrowserDynamic().bootstrapModule(AppModule);
