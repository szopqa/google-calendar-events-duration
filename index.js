const config = require('./config');
const { app } = require('./app');


/**************Input section*****************/
const EVENT_NAME = 'Praca';
const FROM_DATE = '2018-03-26';
const TO_DATE = '2018-03-30';
/********************************************/




(async () => {
    
    try {
        await app(config).getDurationForEventInRange(EVENT_NAME, FROM_DATE, TO_DATE);
    } catch (e) {
        console.log(e);
        process.exit(1)
    }

})()