import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from './axios';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: 'ec4lcsjpb38z2xeyn4uq',
    wsHost: 'localhost',
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                api.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    },
});

export default echo;
