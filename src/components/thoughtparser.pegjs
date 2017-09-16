Thought
  = head:(Temporal/Contact/Hashtag/URL/LiteralWord) space:ws* tail:Thought* {return tail.reduce((p, c) => {
  	return p.concat(c);
  }, [head])}

URL
  = ("http""s"?"://")? URL_Word_dot+ URL_Word ("/" (URL_Word "/"?)*)? {
    return {type: "URL", content: text()};
  }
  
URL_Word
  = [-a-z0-9%@:_+~#=!?&]i+
  
URL_Word_dot
  = URL_Word "."
  
Hashtag
  = "#" URL_Word {return {type: "Hashtag", content: text()};}
  
Contact
  = "@" URL_Word {return {type: "Contact", content: text()};}

LiteralWord
  = [^ \t\r\n]+ {return {type: "Word", content: text()};}
  
Temporal
  = "{" (!"}" .)+ "}" {return {type: "Temporal", content: text()};}

ws "whitespace" 
= [ \t\r\n]+
