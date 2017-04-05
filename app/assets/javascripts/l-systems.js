// Recursively calculate a L-System output string

function calculateLSystem(initial, rules, iterations) {
  if (iterations <= 0) {
    return initial;
  } else {
    //  Transform a line-break separated set of L-System rules from a textarea into a hash
    var rulesHash = rules
      .split("\n")
      .map(function(rule) { return rule.split(/\s*\:\s*/) })
      .reduce(function(hash, rule) { hash[rule[0]] = rule[1]; return hash }, {});

    //  Build a regex for to substitute multiple strings at once
    var regex = new RegExp(Object.keys(rulesHash).join("|"), "gi");

    // Calculate the next iteration
    var nextIteration = initial.replace(regex, function(matched) { return rulesHash[matched] });

    return calculateLSystem(nextIteration, rules, iterations - 1);
  }
}