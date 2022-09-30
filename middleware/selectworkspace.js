const CryptoJS = require("crypto-js");

export default async function({redirect, store, app, $axios}) {
    try {
        if (app.$cookies.get('credentials')) {
            const bytes  = CryptoJS.AES.decrypt(app.$cookies.get('credentials'), process.env.SALT_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            store.commit('auth/credentials', originalText) 
            let profile = await $axios.get('/api/profile')
            let response = profile.data
            if(response.status == 'OK') {
                if(response.data.workspace > 0) {
                    return redirect('/')
                }
            }
        }
    } catch(err) {
        console.log(err)
    }
}