class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {initial: "F++F++F", angle: 60, iterations: 2, rules: "F: F-F++F-F"};

    this.changeInitial    = this.changeInitial.bind(this);
    this.changeAngle      = this.changeAngle.bind(this);
    this.changeIterations = this.changeIterations.bind(this);
    this.changeRules      = this.changeRules.bind(this);
    this.selectSampleRule = this.selectSampleRule.bind(this);
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

  selectSampleRule(event) {
    const sampleRules = {
      "Koch Snowflake":      {initial: "F++F++F", angle: 60, rules: "F: F-F++F-F"},
      "Dragon Curve":        {initial: "FX",      angle: 90, rules: "X: X+YF+\nY: -FX-Y"},
      "Sierpinski Triangle": {initial: "A",       angle: 60, rules: "A: +B-A-B+\nB: -A+B+A-"},
      "Lévy C Curve":        {initial: "F",       angle: 45, rules: "F: +F--F+"}
    };

    this.setState(sampleRules[event.target.value]);
  }

  render() {
    const output = calculateLSystem(this.state.initial, this.state.rules, this.state.iterations);
    const positions = traceLSystem(output, this.state.angle);

    const xValues = positions.map(function(position){ return position.x; });
    const yValues = positions.map(function(position){ return position.y; });

    const minX = Math.min.apply(null, xValues);
    const minY = Math.min.apply(null, yValues);
    const maxX = Math.max.apply(null, xValues);
    const maxY = Math.max.apply(null, yValues);

    const positionsString = positions.map(function(position, index){ return (index == 0 ? "M" : "L") + (position.x - minX) + " " + (position.y - minY) }).join(" ");

    const viewBox = [0, 0, maxX - minX, maxY - minY].join(" ");

    const aspectRatio = 100 * (maxY - minY)/(maxX - minX);

    return (
      <div className="row">
        <div className="four columns">
          <div className="twelve columns" style={ {borderBottom: "1px solid #CCC"} }>
            <label>Select an example L-System or build a custom one below</label>
            <select onChange={this.selectSampleRule}>
              <option value="Koch Snowflake">Koch Snowflake</option>
              <option value="Dragon Curve">Dragon Curve</option>
              <option value="Sierpinski Triangle">Sierpinski Triangle</option>
              <option value="Lévy C Curve">Lévy C Curve</option>
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
              <input type="number" value={this.state.iterations} min="0" max="14" onChange={this.changeIterations} />
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
            <svg style={ { position: "absolute", left: "0", width: "100%", height: aspectRatio + "%", overflow: "visible" } } viewBox={viewBox} preserveAspectRatio="none">
              <path d={positionsString} stroke="black" fill="none" vectorEffect="non-scaling-stroke" strokeWidth="1px" />
            </svg>
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