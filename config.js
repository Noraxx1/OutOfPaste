export default {
    /*----HOSTING----*/
    "port": "1024",
    "address": "localhost",
    /*----STORAGE----*/
    "SaveMetod": "file",
    "DataDirectory": "data",

    /*----STYLE----*/
    "style": "dracula",

    /*----PASTE LIMITS----*/
    "MinChar": 1,
    "MaxChar": 4294967296,

    /*----RATE LIMITING----*/
    "MaximumRequests": 5,
    "every": 60000,

    /*----CACHE----*/
    "fileCreationCacheMax": 100,
    "fileCreationCacheMaxAge": 86400000,

    /*----EXTRA----*/
    "FastMode": false,
    "debug": false
}
