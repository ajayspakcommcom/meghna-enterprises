import React, { useState, useCallback, useMemo } from "react";


interface State {
    value: number;
    count: number;
}


export default function Index() {

    const [state, setState] = useState<State>({value: 0,count: 0});

    const resp = useMemo(async () => {
      return Math.random().toString();
    }, [state.count]);

    const updateValue = useCallback(async () => {
        setState(prevState => ({
          ...prevState,
          value: prevState.value + 1
        }));
      }, []);

      const updateCount = useCallback(async () => {
        setState(prevState => ({
          ...prevState,
          count: prevState.count + 1
        }));
      }, []);

      const computedResult = useMemo(async () => {
        console.log("Computing result..."); // This will only log when value or count changes
        // Simulate an expensive computation
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
          result += (state.value * state.count) / (i + 1);
        }
        return result.toFixed(2);
      }, [state.value, state.count]);

    return (
        <>
              <p>Name : {resp}</p>
              <p>Current Value: {state.value}</p>
              <button onClick={updateValue}>First click</button>
              <hr />
              <p>Current Count: {state.count}</p>
              <button onClick={updateCount}>Second click</button>
        </>
    );
}


