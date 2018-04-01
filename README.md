Simple script used for getting duration of chosen event in Google's Calendar in given time range.
Instruction can be found in config.example.js file


HOW TO USE: 

1 ) run 
    $ npm i

2 ) create config.js file, with own download url, and file name ( see config.example.js )

3 ) Search for duration for chosen event in specified range 

    a) Edit input.js file, and run : 
        $ ./index.js

    or

    b) run:
        $ ./index.js -e <event_name> -f <from_date> -t <to_date>

        example: 
        $ ./index.js -e Praca -f 2018-03-26 -t 2018-03-29  
