require('./jquery-2.0.3.js');
// require('./util/alert.js');
require('./passwords.json')

//IMPORTED CODE//
function mandrillAlert(program_name, subject, body, owners){

    console.log("sending mandrill mail")

    var all_recipient_objects = [];
    var recipients = owners.split(',');
    recipients.forEach(function (entry){
        recipient_object = { "email": entry };
        all_recipient_objects.push(recipient_object);
    });

    var data = {
        "key": "FCppeY-FJBY6_Mvtq_rMKQ",
        "message": 
        {   "html": body,
            "text": body,
            "subject": subject,
            "from_email": "arankhanna25@gmail.com",
            "from_name": program_name,
            "to": all_recipient_objects
        },
        "async": false
    };


    $.ajax({
        type: "POST",
        url: 'https://mandrillapp.com/api/1.0/messages/send.json',
        data: data
    });

    console.log('mandrill mail sent');
}
//IMPORTED CODE//


// The data stream is often redundent, sending points we have already logged.
// Sticks a rudimentary "recently stored" cache in front of the DB to avoid double logging points
// This method is thread-safe and has a global lock allowing only one access at a time.
// function storeWithCache(){

//     mongoWrite();
// }

// Runs a randomized user Agent
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

page.onResourceReceived = function(response) {
	if(response['url'].indexOf("feeds.transloc.com") != -1){
		// console.log(response['url']);
        var json_page = require('webpage').create();
        json_page.open(response['url'], function(status){
            // Check for page load success
            if (status !== "success") {
                // TODO alert error
                console.log("Unable to access network for json.");
            } else {
                // Pull out the json from the innane wrapping
                var re = /(\().+?(?=\);)/g;
                var content = json_page.content.match(re);
                // console.log('Content: ' + String(content).substring(1));
                var json = $.parseJSON(String(content).substring(1));
                if(json['success'] && json['vehicles']){
                    json['vehicles'].forEach(function(bus){
                        // Filter by Harvard Busses
                        if(bus['agency_id'] == 52){
                            // TODO Only add a new data point if timestamp updates
                            // TODO Current stop id is null, until the bus is at a stop (can possibly use this as target for prediction)
                            // TODO store so as to prevent double storage (on timestamp bus id combo) (or filter later to prevent double storage)
                            console.log('Route '+bus['route_id']+', Bus '+bus['call_name']+','+bus['id']+','+bus['timestamp']+": " + bus['position'][0] + ',' + bus['position'][0] + ' at '+ bus['current_stop_id']);
                        }
                    });
                } else {
                    // All JSON that do not contain data are caught here
                    // console.log("Invalid json returned: "+JSON.stringify(json));
                }
            }
            json_page.close();
        });
  	}
};

page.open("http://harvard.transloc.com/", function (status) {
	 // Check for page load success
        if (status !== "success") {
            // TODO alert error
            console.log("Unable to access network for page.");
        } else {
        	console.log("On site, grabbing requests");
            page.evaluate(function () {
        	});
        }
});


// Closes page after a set time this allows for fault tolerance/redundancy.
// TODO set to same length as cron (reset daily) with overlap (as same value won't be double stored so multiple of these can run at once)
setTimeout(
  function() 
  {
    page.close();
    phantom.exit();
  }, 86400000);