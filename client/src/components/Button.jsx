function Button({ text, type, handleAction }) {
  if (type == "utility") {
    return <button onClick={() => handleAction()}>{text}</button>;
  } else if (type == "success") {
    return <button onClick={() => handleAction()}>{text}</button>;
  } else if (type == "failure") {
    return <button onClick={() => handleAction()}>{text}</button>;
  } else {
    return;
  }
}
export default Button;
