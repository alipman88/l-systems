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
    var regex = new RegExp(Object.keys(rulesHash).join("|").replace("+", "\\+"), "gi");

    // Calculate the next iteration
    var nextIteration = initial.replace(regex, function(matched) { return rulesHash[matched] || "" });

    return calculateLSystem(nextIteration, rules, iterations - 1);
  }
}


// Convert an L-System output string into a set of coordinates generated via turtle graphic-like steps

function traceLSystem(steps, angle) {
  var stepsArray = steps.split("");
  var currentAngle = 0;
  var positions = [{x: 0, y: 0}];

  for (var i=0; i < stepsArray.length; i++) {
    var char = stepsArray[i];

    if (char == "+") {
      currentAngle = (currentAngle + angle) % 360;
    } else if (char == "-") {
      currentAngle = (currentAngle - angle) % 360;
    } else if (char.match(/[A-M]/)) {
      var nextX = positions[positions.length - 1].x + Math.cos( currentAngle * Math.PI/180 );
      var nextY = positions[positions.length - 1].y + Math.sin( currentAngle * Math.PI/180 );
      positions.push({x: nextX, y: nextY});
    }
  }

  return positions;
}