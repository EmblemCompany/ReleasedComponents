# Code

This component executes custom JavaScript code. Note that it executes whatever is entered and doesn't contain any security measures or scoping.

```javascript
// 'value' is an {Object} that contains received data
// 'send(outputIndex, newValue) sends 'newValue' to the output at 'outputIndex'
//   'send can be used multiple times
// 'error(value)' sends an error
// 'instance' is an {Object} that represents the current component instance
// 'flowdata' is an {Object} that contains current flowdata
// 'repository' is an {Object} that contains a current repository of flowdata

// Example:

send(0, value);
```