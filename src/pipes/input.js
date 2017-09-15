import datetimesPipe from './datetimes';

// String -> {sanitizedText: String, metadata: any}
const inputPipes = (inputText) => {
  return datetimesPipe(inputText);  
}

export default inputPipes;
