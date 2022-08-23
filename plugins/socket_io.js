import { io } from 'socket.io-client'
export default function({app}, inject) {
    let socket_io = null
    inject('createWsInstance', () => {
        if(socket_io == null) {
            socket_io = io(process.env.WEBSOCKET_URL)
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