
var inputEl = document.getElementById("input");
var outputEl = document.getElementById("output");

inputEl.addEventListener("input", function() {
	const res = parseDate(inputEl.value);
  outputEl.value = JSON.stringify({
  	event: res.event ? ({
    	start: res.event.start.date(),
      end: res.event.end.date(),
    }) : {},
    reminder: res.reminder ? ({
    	start: res.reminder.start.date(),
      end: res.reminder.end.date(),
    }) : {},
  });
});

const INTEGER_WORDS = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
  'ten': 10,
  'eleven': 11,
  'twelve': 12
};
const INTEGER_WORDS_PATTERN = '(?:' + Object.keys(INTEGER_WORDS).join('|') + ')';

var PATTERN = new RegExp('' +
  '(\\W|^)' +
  '(?:within\\s*)?' +
  '(' + INTEGER_WORDS_PATTERN + '|[0-9]+|an?(?:\\s*few)?|half(?:\\s*an?)?)\\s*' +
  '(seconds?|min(?:ute)?s?|hours?|weeks?|days?|months?|years?)\\s*' +
  '(?:from now|henceforth|forward|out)(?=(?:\\W|$))', 'i');

var STRICT_PATTERN = new RegExp('' +
  '(\\W|^)' +
  '(?:within\\s*)?' +
  '([0-9]+|an?)\\s*' +
  '(seconds?|minutes?|hours?|days?)\\s*' +
  'from now(?=(?:\\W|$))', 'i');

const ENTimeFromNowFormatParser = new chrono.Parser();
ENTimeFromNowFormatParser.pattern = function() {
  return this.isStrictMode() ? STRICT_PATTERN : PATTERN;
};

ENTimeFromNowFormatParser.extract = function(text, ref, match, opt) {

  if (match.index > 0 && text[match.index - 1].match(/\w/)) {
    return null;
  }

  var text = match[0];
  text = match[0].substr(match[1].length, match[0].length - match[1].length);
  index = match.index + match[1].length;

  var result = new chrono.ParsedResult({
    index: index,
    text: text,
    ref: ref
  });

  var num = match[2].toLowerCase();
  if (INTEGER_WORDS[num] !== undefined) {
    num = INTEGER_WORDS[num];
  } else if (num === 'a' || num === 'an') {
    num = 1;
  } else if (num.match(/few/)) {
    num = 3;
  } else if (num.match(/half/)) {
    num = 0.5;
  } else {
    num = parseInt(num);
  }

  var date = moment(ref);

  if (match[3].match(/hour|min|second/i)) {
    if (match[3].match(/hour/i)) {

      date.add(+num, 'hour');

    } else if (match[3].match(/min/i)) {

      date.add(+num, 'minute');

    } else if (match[3].match(/second/i)) {

      date.add(+num, 'second');
    }

    result.start.imply('day', date.date());
    result.start.imply('month', date.month() + 1);
    result.start.imply('year', date.year());
    result.start.assign('hour', date.hour());
    result.start.assign('minute', date.minute());
    result.start.assign('second', date.second());
    result.tags['ENTimeFromNowFormatParser'] = true;
    return result;
  }

  if (match[3].match(/week/i)) {
    date.add(+num, 'week');

    result.start.imply('day', date.date());
    result.start.imply('month', date.month() + 1);
    result.start.imply('year', date.year());
    result.start.imply('weekday', date.day());
    return result;
  }

  if (match[3].match(/day/i)) {
    date.add(+num, 'd');
  }

  if (match[3].match(/month/i)) {
    date.add(+num, 'month');
  }

  if (match[3].match(/year/i)) {

    date.add(+num, 'year');
  }

  result.start.assign('day', date.date());
  result.start.assign('month', date.month() + 1);
  result.start.assign('year', date.year());
  return result;

};

var dontImplyNoonRefiner = new chrono.Refiner();
dontImplyNoonRefiner.refine = function(text, results, opt) {
  // If there is no AM/PM (meridiem) specified, 
  //  let all time between 1:00 - 4:00 be PM (13.00 - 16.00)
  results.forEach(function(result) {
    if (!result.start.isCertain('hour')) {
      result.start.assign('hour', 0);
    }
  });
  return results;
}

var addEndDateRefiner = new chrono.Refiner();
addEndDateRefiner.refine = function(text, results, opt) {
  // If there is no AM/PM (meridiem) specified, 
  //  let all time between 1:00 - 4:00 be PM (13.00 - 16.00)
  results.forEach(function(result) {
    if (!result.end) {
      // By default, end everything after one day
      const {
        impliedValues,
        knownValues
      } = result.start;
      const sd = Object.assign(knownValues, impliedValues);

      result.end = new chrono.ParsedComponents(sd, result.ref);
      result.end.assign('hour', 23);
      result.end.assign('minute', 59);
      result.end.assign('second', 59);
    }
  });
  return results;
}

const custom = new chrono.Chrono();
custom.parsers.push(ENTimeFromNowFormatParser);
custom.refiners.push(dontImplyNoonRefiner);
custom.refiners.push(addEndDateRefiner);

const parseDate = (str) => {
  let eventString = null;
  let reminderString = null;
  const reminderMatches = str.match(/(.*?)!(.*)/);
  if (!reminderMatches) {
    eventString = str;
  } else {
    if (!reminderMatches[1].length) {
      reminderString = reminderMatches[2];
    } else if (!reminderMatches[2].length) {
      eventString = reminderMatches[1];
    } else {
      eventString = reminderMatches[1];
      reminderString = reminderMatches[2];
    }
  }

  let parsedEventString = null,
    parsedReminderString = null;
  if (eventString) {
    parsedEventString = custom.parse(eventString, new Date(), {
      forwardDatesOnly: true
    })[0];
  }

  if (reminderString) {
    let startDate = new Date();
    if (parsedEventString) {
      startDate = parsedEventString.start.date();
      reminderString += " ago";
    } else {
      reminderString += " from now";
    }

    parsedReminderString = custom.parse(reminderString, startDate, {
      forwardDatesOnly: true
    })[0];
    if (parsedReminderString) {    
    	/* this is a reminder! if not otherwise noted, end when event starts */
      if (parsedEventString) {
        const {
          impliedValues,
          knownValues
        } = parsedEventString.start;
        const sd = Object.assign(knownValues, impliedValues);

        parsedReminderString.end = new chrono.ParsedComponents(sd, parsedEventString.ref);
      }
    }
  }

  return {
    event: parsedEventString,
    reminder: parsedReminderString
  };
}
