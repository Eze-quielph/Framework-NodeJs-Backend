module.exports = {
  // Convert a URL to a regular expression
  parse: (url) => {
    let str = "";

    // Iterate over the characters in the URL
    for (let i = 0; i < url.length; i++) {
      const char = url[i];

      if (char === ":") {
        // Eat all characters following ':'
        let param = "";

        // Iterate through characters following ':'
        for (var j = i + 1; j < url.length; j++) {
          // Check if the character is a word character (\w)
          if (/\w/.test(url.charAt(j))) {
            // Append the word character to the 'param' string
            param += url.charAt(j);
          } else {
            // Break if a non-word character is encountered
            break;
          }
        }

        // Append the captured parameter as a named capturing group in the regular expression pattern
        str += `(?<${param}>\\w+)`;

        // Update the index to the end of the captured parameter
        i = j - 1;
      } else {
        // If the character is not ':', simply append it to the pattern
        str += char;
      }
    }
  },
};
