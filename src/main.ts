import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from '@env/environment';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
  //show this warning only on prod mode
  if (window) {
    selfXSSWarning();
  }
}

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c¡Hola, GRUPO PDC! 🙌',
      'font-weight: bold; font-size: 2em; color: white; background-color: #4f46e5; padding: 10px; border-radius: 10px;'
    );

    console.log(
      '%cGracias por revisar mi aplicación. 🚀',
      'font-size: 1.5em; color: #4f46e5; font-weight: bold;'
    );

    console.log(
      '%cEsta plataforma está construida con pasión y atención al detalle, usando Angular & TailwindCSS 🌬️',
      'font-size: 1.2em; color: #f59e0b;'
    );

    console.log(
      '%c🔗 Conéctate conmigo: https://www.linkedin.com/in/mario-arita-139527226/',
      'font-size: 1.2em; color: #3b82f6; text-decoration: underline;'
    );
  });
}
