const htmlparser = require("htmlparser2");
const {
  doc: {
    builders: { concat }
  }
} = require("prettier");

var dom;

const handler = new htmlparser.DomHandler(function(error, dom) {
  if (error) console.log(error);
  else poo = dom;
});

const parser = new htmlparser.Parser(handler);

function printDjangoHtml(path, options, print) {
  const node = path.getValue();

  var a;

  if (Array.isArray(node)) {
    return concat(path.map(print));
  }

  switch (node.type) {
    case "text":
      return node.data
    case "tag":
      return concat(
        [
          '<',
          node.name,
          '>',
          concat(path.map(print, 'children')),
          '</',
          node.name,
          '>'
        ]
      )
    default:
      return "hi";
  }
}

const languages = [
  {
    extensions: [".html"],
    name: "Django HTML",
    parsers: ["django-html"]
  }
];

const parsers = {
  "django-html": {
    parse: text => {
      parser.write(text);
      parser.end();
      return poo;
    },
    astFormat: "django-html-ast"
  }
};

const printers = {
  "django-html-ast": {
    print: printDjangoHtml
  }
};

module.exports = {
  languages,
  parsers,
  printers
};
