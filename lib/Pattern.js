function build(name) {
    var re = /<%\w+%>/, match, data = [];
    while(match = re.exec(name)) {
        name = name.replace(match[0], '(\\w+)');
        data.push(match[0].slice(2, -2))
    }
    return {
        regexp: new RegExp('^' + name + '$'),
        paramNames: data
    }
}

function TemplateEngine(tpl, data) {
    var re = /<%([^%>]+)?%>/, match;
    while(match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
}

function Pattern(script) {
    this.script = script;
    var regexpData = build(script.name);
    this.regexp = regexpData.regexp;
    this.paramNames = regexpData.paramNames;
}

Pattern.prototype.matches = function matches(commandName) {
    var match = this.regexp.exec(commandName);

    if (!match){
        return false;
    }

    this.params = {};

    for(var i = 0; i < this.paramNames.length; ++i) {
        this.params[this.paramNames[i]] = match[i + 1];
    }

    return true;
};

Pattern.prototype.getDataForExecution = function getDataForExecution() {
    return JSON.parse(TemplateEngine(JSON.stringify(this.script), this.params))
};

module.exports = Pattern;