import https from 'https'

export default function ({ $axios, $toast, redirect, store }) {
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
            $toast.error('Oops...Something went wrong, Please contact admin', {
                duration: 3000,
                action: {
                    text: 'Cancel',
                    onClick: (e, toastObject) => {
                        toastObject.goAway(0)
                    }
                }
            })
        } else if (code == 401) {
            $toast.error('Invalid username, password or access token expired', {
                duration: 3000,
                action: {
                    text: 'Cancel',
                    onClick: (e, toastObject) => {
                        toastObject.goAway(0)
                    }
                }
            })
      }

    })
  }