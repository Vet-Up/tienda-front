import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/components/pages/app/app';
import { appConfig } from './app/components/pages/app/app.config';


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
