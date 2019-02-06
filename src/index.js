const htmlparser = require("htmlparser2");
const {
  doc: {
    builders: { concat, join }
  }
} = require("prettier");

var globalDom;

const handler = new htmlparser.DomHandler(function(error, dom) {
  if (error) console.log(error);
  globalDom = dom;
});

const parser = new htmlparser.Parser(handler);

function printDjangoHtml(path, options, print) {
  const node = path.getValue();

  if (Array.isArray(node)) {
    return concat(path.map(print));
  }

  switch (node.type) {
    case "text":
      return node.data;
    case "tag":
      return concat([
        "<",
        node.name,
        " ",
        join(
          " ",
          Object.keys(node.attribs).map((key, index) =>
            join("=", [key, join(node.attribs[key], ['"', '"'])])
          )
        ),
        ">",
        concat(path.map(print, "children")),
        "</",
        node.name,
        ">"
      ]);
    case "script":
      return "<!-- HI I'M A SCRIPT TAG -->";
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
      return globalDom;
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
