export default ({ app }, inject) => {
    inject('isValidUrl', (urlString) => {
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return !!pattern.test(urlString.toLowerCase());
    })
}