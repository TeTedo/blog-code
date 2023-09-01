import { useRef } from "react";
import { CSVLink } from "react-csv";
import { useRecoilValue } from "recoil";
import "./App.css";
import { dataState } from "./downloadDataState";

function App() {
  const csvRef = useRef();
  const downloadData = useRecoilValue(dataState);

  const csvDownloadHandler = () => {
    csvRef.current.link.click();
  };
  return (
    <div className="App">
      <div onClick={csvDownloadHandler}>진짜 다운로드 버튼</div>
      <CSVLink
        data={downloadData.data}
        headers={downloadData.headers}
        hidden={true}
        filename="downloadData.csv"
        ref={csvRef}
        target="_blank"
      />
    </div>
  );
}

export default App;
