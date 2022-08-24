import { io } from 'socket.io-client'
export default function({app, store}, inject) {
    let socket_io = null
    inject('createWsInstance', () => {
        if(socket_io == null) {
            socket_io = io(process.env.WEBSOCKET_URL, {
                auth: {
                    token: store.state.auth.credentials
                }
            })
            socket_io.on('message', (data) => {
                console.log(data)
            })
        }
    })
    inject('getWsInstance', () => {
        return socket_io
    })
    inject('destroyWsInstance', () => {
        socket_io.emit('client_disconnect')
        if(socket_io != null) {
            socket_io = null
        }
    })
    inject('wsEmit', (data, event_name) => {
        socket_io.emit(event_name, JSON.stringify(data))
    })
}