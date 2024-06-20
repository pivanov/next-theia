import 'es6-promise/auto';
import 'reflect-metadata';
import 'setimmediate';
import { Container } from 'inversify';
import { FrontendApplicationConfigProvider } from '@theia/core/lib/browser/frontend-application-config-provider';

FrontendApplicationConfigProvider.set({
  applicationName: "Eclipse Theia",
  defaultTheme: {
    light: "light",
    dark: "dark"
  },
  defaultIconTheme: "theia-file-icons",
  electron: {
    windowOptions: {}
  },
  defaultLocale: "",
  validatePreferencesSchema: true
});

(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    return './editor.worker.js';
  }
}

import { preloader } from '@theia/core/lib/browser/preloader';

async function load(jsModule: any) {
  const containerModule = await jsModule.default;
  container.load(containerModule);
}

async function start() {
  const { FrontendApplication } = await import('@theia/core/lib/browser');
  const { frontendApplicationModule } = await import('@theia/core/lib/browser/frontend-application-module');
  const { messagingFrontendModule } = await import('@theia/core/lib/browser/messaging/messaging-frontend-module');
  const { loggerFrontendModule } = await import('@theia/core/lib/browser/logger-frontend-module');

  const container = new Container();
  container.load(frontendApplicationModule);
  container.load(messagingFrontendModule);
  container.load(loggerFrontendModule);

  try {
    await loadModules(container);
    (window as any)['theia'] = (window as any)['theia'] || {};
    (window as any)['theia'].container = container;
    await container.get(FrontendApplication).start();
  } catch (reason) {
    console.error('Failed to start the frontend application.');
    if (reason) {
      console.error(reason);
    }
  }
}

// async function loadModules(container: Container) {
//   await import('@theia/core/lib/browser/i18n/i18n-frontend-module').then(load);
//   await import('@theia/core/lib/browser/menu/browser-menu-module').then(load);
//   await import('@theia/core/lib/browser/window/browser-window-module').then(load);
//   await import('@theia/core/lib/browser/keyboard/browser-keyboard-module').then(load);
//   await import('@theia/core/lib/browser/request/browser-request-module').then(load);
//   await import('@theia/variable-resolver/lib/browser/variable-resolver-frontend-module').then(load);
//   await import('@theia/editor/lib/browser/editor-frontend-module').then(load);
//   await import('@theia/filesystem/lib/browser/filesystem-frontend-module').then(load);
//   await import('@theia/filesystem/lib/browser/download/file-download-frontend-module').then(load);
//   await import('@theia/filesystem/lib/browser/file-dialog/file-dialog-module').then(load);
//   await import('@theia/workspace/lib/browser/workspace-frontend-module').then(load);
//   await import('@theia/markers/lib/browser/problem/problem-frontend-module').then(load);
//   await import('@theia/messages/lib/browser/messages-frontend-module').then(load);
//   await import('@theia/outline-view/lib/browser/outline-view-frontend-module').then(load);
//   await import('@theia/monaco/lib/browser/monaco-frontend-module').then(load);
//   await import('@theia/navigator/lib/browser/navigator-frontend-module').then(load);
//   await import('@theia/userstorage/lib/browser/user-storage-frontend-module').then(load);
//   await import('@theia/preferences/lib/browser/preference-frontend-module').then(load);
//   await import('@theia/process/lib/common/process-common-module').then(load);
//   await import('@theia/terminal/lib/browser/terminal-frontend-module').then(load);
//   // await import('widget/lib/browser/widget-frontend-module').then(load);
// }

// Preload data before starting the frontend
preloader.preload().then(start);
