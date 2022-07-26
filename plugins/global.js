export default ({ app }, inject) => {
    inject('isValidUrl', (urlString) => {
        if(typeof urlString == 'undefined') return false
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return !!pattern.test(urlString.toLowerCase());
    })
    inject('generateInitialName', (fullname) => {
        if(fullname) {
            let split_name = fullname.split(' ')
            let initial = '';
            if(split_name.length > 1) {
                initial = `${split_name[0].charAt(0)}${split_name[split_name.length - 1].charAt(0)}`
            }
            else if(split_name.length == 1) {
                initial = `${split_name[0].charAt(0)}`
            }
            return initial
        }
    })
    inject('convertFileTob64', (file) => {
        var file_reader = new FileReader()
        file_reader.readAsDataURL(file)
        return file_reader
    })
    inject('compressImage', (file, fn = null) => {
        if(typeof file == 'string') {
            let xhr = new XMLHttpRequest()
            xhr.onload = () => {
                var reader = new FileReader()
                reader.readAsDataURL(xhr.response)
                reader.onload = function(e) {
                    var image = new Image()
                    var canvas = document.createElement("canvas");
                    
                    var ctx = canvas.getContext("2d");
                    ctx.canvas.width = 200
                    ctx.canvas.height = 200
                    
                    // Actual resizing
                    
                    image.onload = () => {
                        ctx.drawImage(image, 
                            0, 0,
                            200,200,
                            // 0, 0,
                            // 48, 48
                        );
                        // Show resized image in preview element
                        var data_url = canvas.toDataURL();
                        // document.getElementById("preview").src = dataurl;
                        if(fn != null && typeof fn == 'function') {
                            fn({
                                original_image: reader.result,
                                compress_image: data_url
                            })               
                        }
                    }
                    image.src = reader.result
        
                }
            }
            xhr.open("GET", file, true)
            xhr.responseType = 'blob'
            xhr.send()
        }
        else {
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function(e) {
                var canvas = document.createElement("canvas");
    
                // var canvas = document.getElementById("canvas");
                console.log(reader.result)
                var ctx = canvas.getContext("2d");
    
                // Actual resizing
                ctx.drawImage(img, 0, 0, 64, 64);
    
                // Show resized image in preview element
                var dataurl = canvas.toDataURL(imageFile.type);
                // document.getElementById("preview").src = dataurl;
                if(fn != null && typeof fn == 'function') {
                    fn(dataUrl)               
                }
            }
        }
    })
}