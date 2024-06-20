"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var inversify_1 = require("inversify");
var frontend_application_config_provider_1 = require("@theia/core/lib/browser/frontend-application-config-provider");
var frontend_application_1 = require("@theia/core/lib/browser/frontend-application");
var ws_connection_provider_1 = require("@theia/core/lib/browser/messaging/ws-connection-provider");
function createContainer() {
    var container = new inversify_1.Container();
    // Register other Theia components as needed
    return container;
}
function start() {
    var container = createContainer();
    frontend_application_config_provider_1.FrontendApplicationConfigProvider.set({
        applicationName: 'Theia'
    });
    var connectionProvider = container.get(ws_connection_provider_1.WebSocketConnectionProvider);
    connectionProvider.createProxy('/services');
    var app = container.get(frontend_application_1.FrontendApplication);
    app.start();
}
start();
