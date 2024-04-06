/**
 * Formats an array of milliseconds into a string of the format "hh:mm:ss" or "<hour> s <minute> m <second> s"
 * @param timeInMilliseconds Array of milliseconds
 * @returns String of the format "mm:ss"
 */

export default function formatStopwatchesTime(
  timeInMilliseconds: number[],
  showLetters = false,
  showSeconds = true,
  hideHoursIfZero = true,
  roundSeconds = false
) {
  const totalMilliSeconds = Math.floor(
    timeInMilliseconds.reduce((a, b) => a + b, 0)
  );
  if (totalMilliSeconds === 0) {
    if (showLetters) {
      return "0 s";
    }
    if (hideHoursIfZero) {
      return "00:00";
    }
    return "00:00:00";
  }
  let seconds = Math.floor((totalMilliSeconds % 60000) / 1000);
  let minutes = Math.floor((totalMilliSeconds % 3600000) / 60000);
  let hours = Math.floor(totalMilliSeconds / 3600000);
  if (roundSeconds) {
    if (minutes > 15) {
      seconds = Math.round(seconds / 60) * 60;
      if (seconds === 60) {
        seconds = 0;
        minutes += 1;
      }
    }
  }
  let result = "";
  if (hours > 99) {
    if (showLetters) {
      const _days = Math.floor(hours / 24);
      if (_days > 99) {
        return `99+ j`;
      }
      const _hours = hours % 24;
      result += `${_days.toString()} j`;
      if (_hours > 0) {
        result += ` ${_hours.toString()} h`;
      }
      if (minutes > 0) {
        result += ` ${minutes.toString()} m`;
      }
      if (seconds > 0 && showSeconds) {
        result += ` ${seconds.toString()} s`;
      }
      return result;
    }
    hours = 99;
    minutes = 59;
    seconds = 59;
  }
  if (hours > 0) {
    if (showLetters) {
      result += `${hours.toString()} h `;
    } else {
      result += `${hours.toString().padStart(2, "0")}`;
    }
  } else if (!showLetters && hideHoursIfZero != true) {
    result += `00`;
  }
  if (minutes > 0) {
    if (showLetters) {
      result += `${minutes.toString()} min `;
    } else {
      result += `${minutes.toString().padStart(2, "0")}`;
    }
  } else if (!showLetters) {
    result += `00`;
  }
  if (seconds > 0 && showSeconds) {
    if (showLetters) {
      result += `${seconds.toString()} s`;
    } else {
      result += `${seconds.toString().padStart(2, "0")}`;
    }
  } else if (!showLetters) {
    result += `00`;
  }
  if (!showLetters) {
    result = result.replace(/^(..)(.+)/, "$1:$2");
    result = result.replace(/(.+)(..)$/, "$1:$2");
  }

  result = result.replace(/::/g, ":"); // Remove double colons
  result = result.replace(/^[:.]/, ""); // Remove leading colons
  result = result.replace(/[:.]$/, ""); // Remove trailing colons

  if (showLetters) {
    const containsHours = result.includes("h");
    const containsMinutes = result.includes("min");
    const containsSeconds = result.includes("s");

    if (containsHours && containsMinutes) {
      if (containsSeconds) {
        // Remove trailing "s"
        result = result.replace(/s/g, "").trim();
      } else {
        // Remove trailing "min"
        result = result.replace(/min/g, "").trim();
      }
    } else if (containsMinutes && containsSeconds) {
      // Remove trailing "s"
      result = result.replace(/s/g, "").trim();
    }

    if (containsMinutes && !containsSeconds) {
      const lastWord = result.split(" ").pop();
      if (lastWord && lastWord.length === 1) {
        try {
          const lastWordAsNumber = parseInt(lastWord);
          if (!isNaN(lastWordAsNumber)) {
            // Replace last instance of lastWord with "0<lastWord>"
            result = result.replace(new RegExp(`${lastWord}$`), `0${lastWord}`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    const lastWord = result.split(" ").pop();
    if (lastWord && lastWord.length === 1) {
      try {
        const lastWordAsNumber = parseInt(lastWord);
        if (!isNaN(lastWordAsNumber)) {
          // Replace last instance of lastWord with "0<lastWord>"
          result = result.replace(new RegExp(`${lastWord}$`), `0${lastWord}`);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (containsHours) {
      // Remove leading zero
      result = result.replace(/^(0)(.+)/, "$2");
    }
  } else {
    const containsHours = result.match(/:/g)?.length === 2;
    if (containsHours) {
      // Remove leading zero
      result = result.replace(/^(0)(.+)/, "$2");
    }
  }

  return result.trim();
}
