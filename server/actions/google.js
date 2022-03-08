const axios = require('axios');
const { google } = require('googleapis');
const calendar = google.calendar('v3');

let googleApi = {};

googleApi.APIKEY = 'AIzaSyDYvFWArbrC49RDJIMYgXC0WeNdZt8p1Ak';
googleApi.CLIENT_ID = '171093942489-7pe0ilftvscuv5runqumdoab1la5c4la.apps.googleusercontent.com';
googleApi.CLIENT_SECRET = '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';

googleApi.check_new_comment = async (token, video) => {
    var status = false;

    const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${video}&access_token=${token}`);
    var date = new Date(response.data.items[0].snippet.topLevelComment.snippet.publishedAt);
    var todayDate = new Date();

    if (date.getDate() === todayDate.getDate()) {
        if ((date.getMinutes() + 5) >= todayDate.getMinutes())
            status = true;
    }

    return status;
}

googleApi.check_new_video = async (channel) => {
    var status = false;

    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&channelId=${channel}&key=${googleApi.APIKEY}`);
    var date = new Date(response.data.items[0].snippet.publishTime);
    var todayDate = new Date();

    if (date.getDate() === todayDate.getDate()) {
        if ((date.getMinutes() + 5) >= todayDate.getMinutes())
            status = true;
    }

    return status;
}

googleApi.new_calendar_event = async (token, title, location, description, time) => {
    const oauth2Client = new google.auth.OAuth2(
        googleApi.CLIENT_ID,
        googleApi.CLIENT_SECRET
    );

    oauth2Client.setCredentials({
        access_token: token
    });

    google.options({auth: oauth2Client});

    const eventStartTime = new Date();
    eventStartTime.setDate(eventStartTime.getDate() + 2);

    const eventEndTime = new Date();
    eventEndTime.setDate(eventStartTime.getDate() + parseInt(time));
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

    const event = {
        summary: title,
        location: location,
        description: description,
        start: {
            dateTime: eventStartTime,
            timeZone: 'Europe/Zurich'
        },
        end: {
            dateTime: eventEndTime,
            timeZone: 'Europe/Zurich'
        },
        colorId: 1
    }

    await calendar.freebusy.query({
        resource: {
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timeZone: 'Europe/Zurich',
            items: [{ id: 'primary' }]
        }
    }, (err, res) => {
        if (err)
            return console.error('Free Busy Query Error', err)
        const eventsArr = res.data.calendars.primary.busy;
        if (eventsArr.length === 0)
            return calendar.events.insert({
                calendarId: 'primary', resource: event
            }, err => {
                if (err)
                    return console.err('Calendar Event Creation Error: ', err);
                return console.log('Calendar Event Created');
            })
    })
}

module.exports = googleApi;