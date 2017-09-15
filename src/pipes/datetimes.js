import chrono from 'chrono-node';

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
addEndDateRefiner.refine = function(text, results) {
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
      if (reminderString.indexOf("before") > -1) {
        startDate = parsedEventString.start.date();
        reminderString.replace(/before/, "ago");
      } else {
        startDate = (new Date());
      }
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
      } else {
        const {
          impliedValues,
          knownValues
        } = parsedReminderString.start;
        const sd = Object.assign(knownValues, impliedValues);

        if (!parsedReminderString.end) {
          parsedReminderString.end = new chrono.ParsedComponents(sd, parsedReminderString.ref);
          parsedReminderString.end.assign('hour', 23);
          parsedReminderString.end.assign('minute', 59);
          parsedReminderString.end.assign('second', 59);
        }
      }
    }
  }

  return {
    event: parsedEventString,
    reminder: parsedReminderString
  };
}

const extractDateString = s => (s.match(/{.*?}/) || [null])[0];
const stringWithoutDates = s => s.replace(/{.*?}/, " ");

const datetimesPipe = (input) => {
  const dateString = extractDateString(input);
  if (dateString) {
    const res = parseDate(dateString);
    const datetimeMetadata = {
      event: res.event ? ({
        start: res.event.start.date(),
        end: res.event.end.date(),
      }) : {},
      reminder: res.reminder ? ({
        start: res.reminder.start.date(),
        end: res.reminder.end.date(),
      }) : {},
    };
    return {
      sanitizedText: stringWithoutDates(input),
      metadata: datetimeMetadata,
    };
  } else {
    return {
      sanitizedText: input,
      metadata: {},
    };
  }
}

export default datetimesPipe;
