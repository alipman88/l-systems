class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {initial: "F++F++F", angle: 60, iterations: 2, rules: "F: F-F++F-F", help: false};

    this.changeInitial    = this.changeInitial.bind(this);
    this.changeAngle      = this.changeAngle.bind(this);
    this.changeIterations = this.changeIterations.bind(this);
    this.changeRules      = this.changeRules.bind(this);
    this.sampleRules      = this.sampleRules.bind(this);
    this.selectSampleRule = this.selectSampleRule.bind(this);
    this.drawLSystem      = this.drawLSystem.bind(this);
    this.toggleHelp       = this.toggleHelp.bind(this);
  }

  changeInitial(event) {
    this.setState({initial: event.target.value});
  }

  changeIterations(event) {
    this.setState({iterations: event.target.value});
  }

  changeAngle(event) {
    this.setState({angle: parseInt(event.target.value)});
  }

  changeRules(event) {
    this.setState({rules: event.target.value});
  }

  sampleRules() {
    return {
      "Koch Snowflake":      {initial: "F++F++F", angle: 60, rules: "F: F-F++F-F"},
      "Dragon Curve":        {initial: "FX",      angle: 90, rules: "X: X+YF+\nY: -FX-Y"},
      "Sierpinski Triangle": {initial: "A",       angle: 60, rules: "A: +B-A-B+\nB: -A+B+A-"},
      "Lévy C Curve":        {initial: "F",       angle: 45, rules: "F: +F--F+"},
      "Fractal Plant":       {initial: "S",       angle: 25, rules: "S: ++++X\nX: F-[[X]+X]+F[+FX]-X\nF: FF"}
    };
  }

  selectSampleRule(event) {
    this.setState(this.sampleRules()[event.target.value]);
  }

  toggleHelp(event) {
    this.setState({help: !this.state.help});
    event.preventDefault();
    event.stopPropagation();
  }

  componentDidMount() {
    this.drawLSystem();
  }

  componentDidUpdate() {
    this.drawLSystem();
  }

  // Update the SVG image in response to state change
  drawLSystem() {
    d3.select("svg").selectAll("*").remove();
    var output  = calculateLSystem(this.state.initial, this.state.rules, this.state.iterations);
    var tracing = traceLSystem(output, this.state.angle);

    // Create an SVG path element from the set of turtle positions
    line = [];
    for (var i=0; i<tracing.positions.length; i++) {
      if (tracing.positions[i] != null) {
        char = tracing.positions[i-1] == null ? "M" : "L";
        line.push(char + tracing.positions[i].x + "," + tracing.positions[i].y);
      }
    }

    d3.select("svg")
      .attr("viewBox", [0, 0, tracing.width, tracing.height].join(" "))
      .style({"height": 100 * tracing.height/tracing.width + "%"});

    d3.select("svg")
      .append("path")
      .attr("d", line.join())
      .attr("stroke", "black")
      .attr("stroke-width", 0.1)
      .attr("fill", "none");
  }

  render() {
    return (
      <div className="row">
        <div className="four columns">
          <div className="twelve columns">
            <label><a href="#" onClick={this.toggleHelp}>Instructions</a></label>
          </div>

          <div id="help" className="twelve columns" style={ {display: this.state.help ? "block" : "none", borderBottom: "1px solid #CCC" } }>
            <p><a href="https://en.wikipedia.org/wiki/L-system" target="_blank">L-Systems</a> are a type of formal grammar which uses recursively-applied character substitution rules to produce strings that can then be translated into fractal images via turtle graphics. Each character in the output string corresponds to an instruction like "turn right," "turn left," or "move forward."</p>
            <p>In the widget below, the characters <span style={ {fontFamily: "monospace"} }>+</span> and <span style={ {fontFamily: "monospace"} }>-</span> rotate the turtle left and right. The letters <span style={ {fontFamily: "monospace"} }>A-M</span> move the turtle forward one step, and the letters <span style={ {fontFamily: "monospace"} }>N-Z</span> are placeholders which don't produce any action, but control the outcome's evolution. <span style={ {fontFamily: "monospace"} }>[</span> and <span style={ {fontFamily: "monospace"} }>]</span> are special symbols, which push to or pop the turtle's position from an array, causing the turtle to jump from one position to another.</p>
          </div>

          <div className="twelve columns" style={ {borderBottom: "1px solid #CCC"} }>
            <label>Select an example L-System or build a custom one below</label>
            <select onChange={this.selectSampleRule}>
              {Object.keys(this.sampleRules()).map(function(value){
                return <option key={value} value={value}>{value}</option>;
              })}
            </select>
          </div>

          <div className="row">
            <div className="four columns">
              <label>Initial state</label>
              <input type="text" value={this.state.initial} onChange={this.changeInitial} />
            </div>

            <div className="four columns">
              <label>Angle</label>
              <input type="number" value={this.state.angle} min="0" max="360" onChange={this.changeAngle} />
            </div>

            <div className="four columns">
              <label>Iterations</label>
              <input type="number" value={this.state.iterations} min="0" max="16" onChange={this.changeIterations} />
            </div>
          </div>

          <div className="row" style={ {borderBottom: "1px solid #CCC"} }>
            <div className="twelve columns">
              <label>Rules</label>
              <textarea value={this.state.rules} onChange={this.changeRules} />
            </div>
          </div>

          <div className="row">
            <div className="twelve columns">
              <p style={ {textAlign: "right"} }>
                <a href="https://github.com/alipman88/l-systems" target="_blank"><i className="fa fa-github" aria-hidden="true"></i> Source code</a>
              </p>
            </div>
          </div>
        </div>

        <div className="eight columns">
          <div style={ { position: "relative", float: "left", width: "100%", height: "0", paddingBottom: "100%" } }>
            <svg style={ { position: "absolute", left: "0", width: "100%", marginBottom: "50px", overflow: "visible" } } preserveAspectRatio="none"></svg>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);