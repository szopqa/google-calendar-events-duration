const fs = require('fs');
const axios = require('axios');
const path = require('path');  
const ical = require('ical');
const _ = require('lodash');
const moment = require('moment');


const DATE_FORMAT = 'YYYY-MM-DD HH:mm Z';


const downloadCalendarFile = async (downlaodURL, outputFilename) => {
    const filePath = path.resolve(__dirname, outputFilename);
    const response = await axios({
        method: 'GET',
        url: downlaodURL,
        responseType: 'stream'
    });

    if(! response) {throw new Error (`Could not fetch data from ${downlaodURL}`)}
    
    response.data.pipe(fs.createWriteStream(filePath));
    return new Promise((resolve, reject) => {
        response.data.on('end', () => resolve());
        response.data.on('error', () => reject());
    })
};

const parseICSFile = (filename) => {
    if ( ! fs.existsSync(filename)) {
        throw new Error(`File ${filename} not found in ${__dirname}!`);
    }
    return ical.parseFile(filename);
};

const getAllEventOccurrences = (allEvents, searchingEventName) => {
    return Object.keys(allEvents)
                    .map(eventID => allEvents[eventID])
                    .filter(event => event.summary === searchingEventName);
};

const getAllInTimeRange = (events, fromDate, toDate) => {
    return events.filter(event => {
        const eventStart = moment(JSON.stringify(event.start), DATE_FORMAT);
        const eventEnd = moment(JSON.stringify(event.end), DATE_FORMAT);

        return eventStart.isSameOrAfter(fromDate, 'day') && eventEnd.isSameOrBefore(toDate, 'day');
    });
};

const getDuration = (validEvents) => {
    let duration = 0;
    for (const event of validEvents) {
        const eventStart = moment(JSON.stringify(event.start), DATE_FORMAT);
        const eventEnd = moment(JSON.stringify(event.end), DATE_FORMAT);

        duration += moment.duration(eventEnd.diff(eventStart));
    } 
    return duration / (1000 * 60 * 60);
};

const formatOutput = (eventName, eventsDuration, from, to) => { 
    console.log(`Event : ${eventName} takes ${eventsDuration} hours between ${from} and ${to}`);
}





const app = ({googleCalendarDownloadURL, calendarFileName}) => {

    const getDurationForEventInRange = async (eventName, fromDate, toDate) => {
        let calendarData;
        try {
            await downloadCalendarFile(googleCalendarDownloadURL, calendarFileName);
            calendarData = parseICSFile(calendarFileName);
        } catch (e) {
            throw new Error(e);
        }

        const allEventOccurrences = getAllEventOccurrences (calendarData, eventName);
        const eventsInRange = getAllInTimeRange (allEventOccurrences, fromDate, toDate);
        const eventsDuration = getDuration(eventsInRange);

        return formatOutput(eventName, eventsDuration, fromDate, toDate);
    }
    
    return {getDurationForEventInRange}
};

module.exports = {app}