import https from 'https'
import Swal from 'sweetalert2'

export default function ({ $axios, $toast, redirect, store, app }) {
    $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })
    $axios.onRequest(config => {
        if (store.state.auth.credentials) {
            config.headers.common['Authorization'] = `Bearer ${store.state.auth.credentials}`
        }
        
    })

    $axios.onResponse(response => {
        // if (response.status == 200) {
          
        // }
    })
  
    $axios.onError(error => {
      const code = parseInt(error.response && error.response.status)
        if (code == 500) {
            alert('Oops...Something went wrong')
        } else if (code == 401) {
            if(app.router.currentRoute.path.startsWith('/login')) {
                Swal.fire({
                    text: 'Invalid user domain or password',
                    toast: true,
                    timer: 3000,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    showCancelButton: false,
                    icon: 'error',
                    title: 'Login Failed'
                })
            }
            else {
                Swal.fire({
                    text: 'Access token expired please Relogin',
                    position: 'center',
                    showConfirmButton: true,
                    showCancelButton: false,
                    icon: 'error',
                    title: 'Token Expired'
                })
            }
            store.commit('auth/destroy')
            app.$cookies.remove('credentials')
            return redirect('/login/')
      }
    })
  }