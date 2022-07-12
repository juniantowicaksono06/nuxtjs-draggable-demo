export default ({ app }, inject) => {
    inject('isValidUrl', (urlString) => {
        if(typeof urlString == 'undefined') return false
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return !!pattern.test(urlString.toLowerCase());
    })
}