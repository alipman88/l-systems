class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {initial: "F++F++F", angle: 60, iterations: 2, rules: "F: F-F++F-F"};

    this.changeInitial    = this.changeInitial.bind(this);
    this.changeAngle      = this.changeAngle.bind(this);
    this.changeIterations = this.changeIterations.bind(this);
    this.changeRules      = this.changeRules.bind(this);
    this.sampleRules      = this.sampleRules.bind(this);
    this.selectSampleRule = this.selectSampleRule.bind(this);
    this.drawLSystem      = this.drawLSystem.bind(this);
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
      "Fractal Plant":       {initial: "X",       angle: 25, rules: "X: F-[[X]+X]+F[+FX]-X\nF: FF"}
    };
  }

  selectSampleRule(event) {
    this.setState(this.sampleRules()[event.target.value]);
  }

  componentDidMount() {
    this.drawLSystem();
  }

  componentDidUpdate() {
    this.drawLSystem();
  }

  drawLSystem() {
    d3.select("svg").selectAll("*").remove();
    var output  = calculateLSystem(this.state.initial, this.state.rules, this.state.iterations);
    var tracing = traceLSystem(output, this.state.angle);

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

          <div className="row">
            <div className="twelve columns">
              <label>Rules</label>
              <textarea value={this.state.rules} onChange={this.changeRules} />
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