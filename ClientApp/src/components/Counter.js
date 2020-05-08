import React, { useState } from 'react';
import { useStoreOf } from '@stores';


export function Counter() {
  const [counter, addCounter] = useStoreOf('counter', 'addCounter');

  const handleAddCounter = () => addCounter(1);

  return (
    <div>
      <h1>Counter</h1>

      <p>This is a simple example of a React component.</p>

      <p aria-live="polite">Current count: <strong>{counter}</strong></p>

      <button className="btn btn-primary" onClick={handleAddCounter}>Increment</button>
    </div>
  );
}
