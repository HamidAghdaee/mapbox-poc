//write a function called series which takes a series of functions as an array
//as its first argument and a callback function as its second argument
//It should return a new function. When the new function is called with whatever arguments(s)
//it is expected that the first in the chain of functions is called with the these arguments asynchronously.
//It is expected that the return value from the first call is passed as an argument
//to the second function in the series and the 2nd function is called asynchrnously
//In this fashion all functions in the series are executed. After the last function has executed,
//the callback function should be called asynchrously with the return value of the last funnction in the series.
//If any of the functions in the series throws an error, then the callback function should be called syncronously
//with null as its first argument and the error as its second argument

const series = (funcs, callback) => {
  let index = 0;
  const func = (...args) => {
    setTimeout(() => {
      if (index === funcs.length) {
        return callback(...args);
      }

      try {
        const result = funcs[index](...args);
        index = index + 1;

        func(result);
      } catch (error) {
        callback(null, error);
      }
    });
  };

  return func;
};

const callback = (...args) => {
  console.log('foo');
  console.log(args);
};

const funcs = [
  (...args) => {
    console.log('0', args);
    setTimeout(() => {
      console.log('called from 0');
    });
    return 0;
  },
  (...args) => {
    console.log('1', args);
    return 1;
  },
];

const s = series(funcs, callback);
s('foo', 'bar');
console.log('hello');
