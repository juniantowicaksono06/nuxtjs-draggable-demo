import https from 'https'

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
            alert('Invalid user domain, password or access token expired')
            store.commit('auth/destroy')
            app.$cookies.remove('credentials')
            return redirect('/login/')
      }
    })
  }