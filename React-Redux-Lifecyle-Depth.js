//https://codesandbox.io/s/l531n0n439
import React from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";

const reducers = (state = {}, action) => {
  switch (action.type) {
    case "initiate":
      return Object.assign({ number: 0 }, state);
    case "add":
      return Object.assign(state, { number: state.number + 1 });
    case "sub":
      return Object.assign(state, { number: state.number - 1 });
    case "save":
      return Object.assign(state, { number: action.number });
  }
};

const createStore = (initialState = {}, reducers) => {
  let state = initialState;
  let listeners = [];
  const getState = () => state;
  const dispatch = action => {
    state = reducers(state, action);
    listeners.forEach(listener => listener());
  };
  const subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  return { getState, dispatch, subscribe };
};

var store = createStore({}, reducers);

const unsubscribe = store.subscribe(() => {
  console.log(JSON.stringify(store.getState()));
});

store.dispatch({ type: "initiate" });
store.dispatch({ type: "add" });
store.dispatch({ type: "add" });
store.dispatch({ type: "add" });
store.dispatch({ type: "add" });
store.dispatch({ type: "sub" });
store.dispatch({ type: "sub" });
//unsubscribe();
store.dispatch({ type: "sub" });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    parseInt(e.target.value)
      ? this.props.dispatch({ type: "save", number: parseInt(e.target.value) })
      : "";
    this.forceUpdate();
  }
  componentDidMount() {
    console.log("componentDidMount");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate");
    console.log(prevProps, prevState, snapshot);
  }
  getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps");
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate");
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");
    console.log(nextProps, nextState);
    return true;
  }
  componentDidCatch(error, info) {
    console.log("componentDidCatch");
    console.log(error, info);
  }
  UNSAFE_componentWillMount() {
    console.log("UNSAFE_componentWillMount");
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("UNSAFE_componentWillReceiveProps");
  }
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    console.log("UNSAFE_componentWillUpdate");
  }
  render() {
    return (
      <div>
        <input
          type="button"
          value="+"
          onClick={() => this.props.dispatch({ type: "add" })}
        />
        <input
          type="text"
          value={this.props.number}
          onChange={this.handleChange}
        />
        <input
          type="button"
          value="-"
          onClick={() => this.props.dispatch({ type: "sub" })}
        />
      </div>
    );
  }
}
App.propTypes = {
  number: PropTypes.number,
  dispatch: PropTypes.func
};
store.subscribe(() =>
  render(
    <App number={store.getState().number} dispatch={store.dispatch} />,
    document.getElementById("app")
  )
);
store.dispatch({ type: "sub" });
store.dispatch({ type: "add" });
store.dispatch({ type: "add" });
store.dispatch({ type: "add" });
