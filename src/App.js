import React, { useRef } from "react";
import "./App.css";

function App() {
  const inputFile = useRef(null);

  const handleButtonClick = () => {
    inputFile.current.click();
    console.log(inputFile.current);
  };

  const onChangeFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const matches = text.match(/<td.*>.*<\/td>/g);
      console.log(`${matches.length} matched`);
      let index = matches.findIndex((el) => {
        return el.includes("Aposta A:");
      });
      console.log(index);
      // console.log(matches[index + 1]);
      let tens = matches[index].match(
        /.*(\d\d).*(\d\d).*(\d\d).*(\d\d).*(\d\d).*(\d\d).*/m,
      );
      tens.shift();
      console.log(tens[0], tens[1], tens[2], tens[3], tens[4], tens[5]);

      if (matches[index + 2].includes("Aposta B:")) {
        tens = matches[index + 2].match(
          /.*(\d\d).*(\d\d).*(\d\d).*(\d\d).*(\d\d).*(\d\d).*/m,
        );
        tens.shift();
        console.log(tens[0], tens[1], tens[2], tens[3], tens[4], tens[5]);
      }

      if (matches[index + 4].includes("Aposta C:")) {
        tens = matches[index + 4].match(
          /.*(\d\d).*(\d\d).*(\d\d).*(\d\d).*(\d\d).*(\d\d).*/m,
        );
        tens.shift();
        console.log(tens[0], tens[1], tens[2], tens[3], tens[4], tens[5]);
      }

      index = matches.findIndex((el) => {
        return el.includes("CONCURSO 2");
      });
      let dateFields = matches[index].match(
        /CONCURSO (\d\d\d\d) (\d\d)([A-Z][A-Z][A-Z])(\d\d\d\d).*/m,
      );
      dateFields.shift();
      console.log(dateFields[0], dateFields[1], dateFields[2], dateFields[3]);

      let value = matches[index + 1].match(/TOTAL: (R\$ [^<]+).*/m);
      value.shift();
      console.log(value[0]);
    };

    reader.readAsText(file);
    // console.log(file);
  };

  return (
    <div className="App">
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={onChangeFile}
        style={{ display: "none" }}
      />
      <button onClick={handleButtonClick}>Open File</button>
      {inputFile && <div>{inputFile.current}</div>}
    </div>
  );
}

export default App;
