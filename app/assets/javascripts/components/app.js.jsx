class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {initial: "A", angle: 90, iterations: 1, rules: "A: A+"};

    this.changeInitial    = this.changeInitial.bind(this);
    this.changeAngle      = this.changeAngle.bind(this);
    this.changeIterations = this.changeIterations.bind(this);
    this.changeRules      = this.changeRules.bind(this);
  }

  changeInitial(event) {
    this.setState({initial: event.target.value});
  }

  changeIterations(event) {
    this.setState({iterations: event.target.value});
  }

  changeAngle(event) {
    this.setState({angle: event.target.value});
  }

  changeRules(event) {
    this.setState({rules: event.target.value});
  }

  render() {
    const output = calculateLSystem(this.state.initial, this.state.rules, this.state.iterations);

    return (
      <div className="row">
        <div className="four columns">
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
              <input type="number" value={this.state.iterations} min="0" max="10" onChange={this.changeIterations} />
            </div>
          </div>

          <div className="row">
            <div className="twelve columns">
              <label>Rules</label>
              <textarea value={this.state.rules} onChange={this.changeRules} />
            </div>
          </div>

          <div className="row">
            <div className="twelve columns">
              <label>Results</label>
              <textarea value={output} readOnly />
            </div>
          </div>
        </div>

        <div className="eight columns">{/* SVG element will go here */}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);