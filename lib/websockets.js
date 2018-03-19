"use babel";
/** @jsx etch.dom */

const {Disposable, CompositeDisposable} = require('via');
const etch = require('etch');
const ViaTable = require('via-table');
const base = 'via://websockets';
const moment = require('moment');
const status = {0: 'Connecting', 1: 'Open', 2: 'Closing', 3: 'Closed'};

module.exports = class Websockets {
    constructor(state){
        this.disposables = new CompositeDisposable();
        this.columns = ['URI', 'Status', 'Opened On'];
        this.websockets = via.websockets.all();

        this.columns = [
            {
                name: 'uri',
                title: 'Websocket URI',
                default: true,
                accessor: w => w.uri, classes: 'uri'
            },
            {
                name: 'status',
                title: 'Connection Status',
                default: true,
                accessor: w => status[w.status]
            },
            {
                name: 'date',
                title: 'Opened At',
                default: true,
                accessor: w => (w.opened ? moment(w.opened).format('YYYY-MM-DD HH:mm:ss') : 'N/A')
            }
        ];

        etch.initialize(this);

        this.disposables.add(via.websockets.onDidCreateSocket(this.update.bind(this)));
        this.disposables.add(via.websockets.onDidDestroySocket(this.update.bind(this)));
        this.disposables.add(via.websockets.onDidWebsocketStatusChange(() => etch.update(this)));
    }

    destroy(){
        this.disposables.dispose();
        etch.destroy(this);
    }

    update(){
        this.websockets = via.websockets.all();
        etch.update(this);
    }

    render(){
        return (
            <div className='websockets panel-body padded'>
                <ViaTable columns={this.columns} data={this.websockets}></ViaTable>
            </div>
        );
    }

    getDefaultLocation(){
        return 'bottom';
    }

    getPreferredLocation(){
        return this.getDefaultLocation();
    }

    isPermanentDockItem(){
        return false;
    }

    getTitle(){
        return 'Websockets';
    }

    getURI(){
        return base;
    }
}
