import "./App.css";
import { RecoilCounter } from "./recoil/view/RecoilCounter";
import { ReduxCounter } from "./redux/view/ReduxCounter";

function App() {
  return (
    <div className="App">
      <ReduxCounter></ReduxCounter>
      <RecoilCounter></RecoilCounter>
    </div>
  );
}

export default App;
