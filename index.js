#!/usr/bin/env node 
'use strict';

const script = require('commander');

const config = require('./config');
const { app } = require('./app');

const { EVENT_NAME, FROM_DATE, TO_DATE } = require('./input');

script
    .version('1.0.0')
    .description('Calculates event\'s duration in given time range')
    .option('-e, --event <e>', 'Event name')
    .option('-f, --fromDate <f>', 'Start date to calculate duration')
    .option('-t, --toDate <t>', 'End date to calcualte duration')
    .parse(process.argv);


/**
 * Checking if arguments were passed in command line, if no use data from input.js
 */
const getInput = () => {
    const {event, fromDate, toDate} = script;
    
    if (event && fromDate && toDate) {
        return setInput(event, fromDate, toDate);
    } else {
        return setInput(EVENT_NAME, FROM_DATE, TO_DATE);
    }
}

const setInput = (eventName, fromDate, toDate) => {
    return {
        eventName,
        fromDate,
        toDate
    }
}


(async () => {
    
    try {
        await app(config).getDurationForEventInRange(getInput());
    } catch (e) {
        console.log(e);
        process.exit(1)
    }

})()