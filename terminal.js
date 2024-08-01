import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const logDirectory = path.resolve('./.logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const terminal = {
    error: function(text, options = { showPath: true, showLine: true, showDate: true }) {
        logMessage('ERROR', chalk.red, text, options);
        process.exit(1);
    },
    
    warning: function(text, options = { showPath: true, showLine: true, showDate: true }) {
        logMessage('WARNING', chalk.hex('#FFA500'), text, options);
    },
    
    note: function(text, options = { showPath: true, showLine: true, showDate: true }) {
        logMessage('NOTE', chalk.yellow, text, options);
    }
};

function logMessage(level, color, text, options) {
    const { showPath, showLine, showDate } = options;
    const stack = new Error().stack;
    const callerInfo = extractCallerInfo(stack);
    const fileName = callerInfo ? path.basename(callerInfo.fileName) : '';
    const lineNumber = callerInfo ? callerInfo.lineNumber : '';
    const now = new Date();
    const timestamp = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const logFileName = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.log`;
    const logFilePath = path.join(logDirectory, logFileName);
    
    let message = `${color(`[ ${level} ]`)}${chalk.white(':')} ${text}`;
    if (showPath && fileName) message += ` ${chalk.yellow(fileName)}`;
    if (showLine && lineNumber) message += `:${chalk.cyan(lineNumber)}`;
    if (showDate) message += ` ${chalk.green(timestamp)}`;
    
    console.log(message);
    let logFileMessage = `${timestamp} - [ ${level} ]: ${text}`;
    if (showPath && fileName) logFileMessage += ` ${fileName}`;
    if (showLine && lineNumber) logFileMessage += `:${lineNumber}`;
    fs.appendFileSync(logFilePath, logFileMessage + '\n');
}

function extractCallerInfo(stack) {
    const lines = stack.split('\n');
    for (let i = 2; i < lines.length; i++) {
        const match = lines[i].match(/at .*\((.*):(\d+):(\d+)\)$/);
        if (match) {
            return {
                fileName: match[1],
                lineNumber: match[2]
            };
        }
    }
    return null;
}

export default terminal;
