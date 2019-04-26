#!/usr/bin/env node
/* global console */
/* eslint-disable no-console */

const borderChar = '#';
const charsPerLine = 64;
const paddingLength = 5;
const emptyChars = (charsPerLine - paddingLength * 2);

/**
 * Log an empty line
 *
 * @return {undefined}
 */
function logEmpty() {
  console.log(' '.repeat(charsPerLine));
}

/**
 * Log a line that represents a border
 *
 * @return {undefined}
 */
function logBorder() {
  logMessage(borderChar.repeat(emptyChars), true)
}

/**
 * Log message
 *
 * @param {String} [msg] - message to log
 * @param {Boolean} [allowFull] - allow message to be 100% of the available space
 *
 * @return {undefined}
 */
function logMessage(msg, allowFull) {
  let data;

  if (msg) {
    const msgLength = msg.length;
    const remainingChars = emptyChars - msgLength;
    if (remainingChars >= 4 || allowFull) {
      // only if we have at lest 2 empty spaces around message
      // or if we log full message (border)
      const padding = remainingChars / 2;
      data = `${' '.repeat(Math.floor(padding))}${msg}${' '.repeat(Math.ceil(padding))}`
    }
  }

  if (!data) {
    data = ' '.repeat(emptyChars);
  }

  const prefix = borderChar.padStart(paddingLength, ' ');
  const suffix = borderChar.padEnd(paddingLength, ' ');

  console.log(`${prefix}${data}${suffix}`)
}

logEmpty();
logBorder();
logMessage('babel-plugin-auto-logger');
logBorder();
logMessage();
logMessage('Plugin is completely open source.');
logMessage('Please consider supporting the author by donating.');
logMessage();
logMessage('https://www.patreon.com/paul_comanici');
logMessage();
logBorder();
logEmpty();

/* eslint-enable no-console */
