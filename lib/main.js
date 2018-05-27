const {CompositeDisposable, Disposable} = require('via');
const Websockets = require('./websockets');
const base = 'via://websockets';

const InterfaceConfiguration = {
    name: 'Websockets',
    description: 'Monitor open websocket connections.',
    command: 'websockets:open',
    uri: base
};

class WebsocketsPackage {
    initialize(){
        this.disposables = new CompositeDisposable();
        this.websockets = null;

        this.disposables.add(via.commands.add('via-workspace', {
            'websockets:toggle': () => this.getWebsocketsInstance().toggle(),
            'websockets:show': () => this.getWebsocketsInstance().show(),
            'websockets:hide': () => this.getWebsocketsInstance().hide(),
            'websockets:focus': () => this.getWebsocketsInstance().focus(),
            'websockets:unfocus': () => this.getWebsocketsInstance().unfocus()
        }));
    }

    getWebsocketsInstance(state = {}){
        if(!this.websockets){
            this.websockets = new Websockets(state);
            this.websockets.onDidDestroy(() => this.websockets = null);
        }

        return this.websockets;
    }

    deactivate(){
        this.disposables.dispose();

        if(this.websockets){
            this.websockets.destroy();
        }
    }
}

module.exports = new WebsocketsPackage();
