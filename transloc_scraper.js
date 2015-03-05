require('./jquery-2.0.3.js');

function getUserAgent(){
    var items = Array(
        'Mozilla/5.0 (Windows NT 6.1; rv:9.0) Gecko/20100101 Firefox/9.0',
        'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/1.0.154.53 Safari/525.19',
        'Opera/9.80 (X11; Linux i686; U; ru) Presto/2.8.131 Version/11.11',
        'Mozilla/5.0 (X11; Linux i686 on x86_64; rv:12.0) Gecko/20100101 Firefox/12.0');
    return items[Math.floor(Math.random()*items.length)];
}


var page = require('webpage').create();
page.settings.userAgent = getUserAgent();

// page.onResourceRequested = function(request) {
//   console.log('Request ' + JSON.stringify(request, undefined, 4));
// };

page.onResourceReceived = function(response) {
	if(response['url'].indexOf("feeds.transloc.com") != -1){
		console.log(response['url']);
  	}
};

page.open("http://harvard.transloc.com/", function (status) {
	 // Check for page load success
        if (status !== "success") {
            console.log("Unable to access network");
        } else {
        	console.log("On site, grabbing requests");
        	page.evaluate(function () {
        	});
        }
});