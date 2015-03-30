// Requires JQuery 2.0.3 and above
require('./../jquery-2.0.3.js');

/**
 * Send a structured email, via the mandrill rest api, and AJAX
 * @arg owners: CSV list of email addresses (no spaces).
 */
function mandrillAlert(program_name, subject, body, owners){

    console.log("sending mandrill mail");

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
            "from_email": "8guys1block@gmail.com",
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