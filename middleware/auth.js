const CryptoJS = require("crypto-js");


export default function ({ redirect, store, app }) {
    if (app.$cookies.get('credentials')) {
        try {
            const bytes  = CryptoJS.AES.decrypt(app.$cookies.get('credentials'), process.env.SALT_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (!originalText) {
                return redirect('/login/')
            }
            
        } catch (error) {
            return redirect('/login/')
        }
    } else {
        return redirect('/login/')
    }   
}