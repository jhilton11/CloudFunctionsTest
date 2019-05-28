const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp();

const notifRef = admin.database().ref("/NotificationTokens");
var notifTokens = [];

exports.sendNotifications = functions.database.ref('/audiomessages/{audiomsgId}')
.onCreate((snapshot, context) => {

    const title = snapshot.val().title;    
    console.log('A news article has been added to the database with the title ' + title);

    let payLoad = {
        data: {
            title:"News",
            body: title
        }
    };

    return notifRef.once("value", function(snapshot) {
        if (snapshot.hasChildren) {
            snapshot.forEach(function (childSnapshot){
                const token = childSnapshot.val();
                console.log('The value of token is ' + token.id);
                notifTokens.push(token.id);
            });
            return admin.messaging().sendToDevice(notifTokens, payLoad);
        } else {
            console.log("Snapshot has no children");
            return;
        }  

    });
});