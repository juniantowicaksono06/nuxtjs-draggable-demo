const CryptoJS = require("crypto-js");

export default function({redirect, store, app}) {
    try {
        const bytes  = CryptoJS.AES.decrypt(app.$cookies.get('identity'), process.env.SALT_KEY);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        originalText = JSON.parse(originalText)
        if(originalText.hasWorkspace == false) {
            return redirect('/selectworkspace')
        }
        
    } catch (error) {
        console.log(error)
    }
}