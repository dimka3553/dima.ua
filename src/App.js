import React, { Component } from "react";
import filesystem from "./filesystem.json";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleTimeString(),
      intf: [
        `Last login: ${new Date().toLocaleTimeString()}`,
        <br />,
        "Type ‘help’ for command list",
        <br />,
      ],
      input: "",
      inputArray: [<mark key={0}>&nbsp;</mark>],
      lastKey: "",
      lastTimestampOfKey: 0,
      cursorPosition: 0,
      path: "",
      cmdList: [""],
      cmdPosition: 0,
    };
    this.handleCommand = this.handleCommand.bind(this);
  }

  handleCommand(command, event) {
    var intf = this.state.intf;
    intf.push(
      <span>
        DimasWebsite@you {this.state.path} ~ %<span>&nbsp;</span>
        {command}
      </span>
    );
    var result;
    var args;
    if (command !== "") {
      result = command.trim().split(/\s+/);
      command = result[0];
      args = result.slice(1);
    }

    let path = this.state.path;
    if (command === "help") {
      const helpoutput = filesystem.commands.help.split(/\r?\n/);
      intf.push(<br />);
      for (let i = 0; i < helpoutput.length; i++) {
        intf.push(<pre>{helpoutput[i]}</pre>);
      }
      intf.push(<br />);
    } else if (command === "clear") {
      intf = [];
    } else if (command === "cd") {
      console.log(command, args, args.length);
      if (args.length === 0) {
        path = "";
      } else if (args.length === 1) {
        if (args[0] === "..") {
          path = "";
        }
        const fs = Object.keys(filesystem.root);
        console.log(fs);
        if (fs.includes(args[0])) {
          path = args[0];
        } else {
          intf.push(<span>cd: Invalid directory: {args[0]}</span>);
        }
      }
    } else if (command === "ls") {
      intf.push(<br />);
      if (args.length === 0) {
        if (this.state.path === "") {
          Object.keys(filesystem.root).forEach((key) => {
            intf.push(<span>{key}</span>);
          });
        } else {
          Object.keys(filesystem.root[this.state.path]).forEach((key) => {
            intf.push(<span>{key}</span>);
          });
        }
      } else {
        try {
          if (this.state.path === "") {
            console.log(args);

            Object.keys(filesystem.root[args[0]]).forEach((key) => {
              intf.push(<span>{key}</span>);
            });
          } else {
            intf.push(<span>no such direcrory: {args}</span>);
          }
        } catch {
          intf.push(<span>no such directory: {args}</span>);
        }
      }
      intf.push(<br />);
    } else if (command === "date") {
      intf.push(<br />);
      intf.push(<span>{new Date().toString()}</span>);
      intf.push(<br />);
    } else if (command === "cat") {
      if (args.length === 0) {
        intf.push(<span>cat: missing file name: {args[0]}</span>);
      } else {
        try {
          let output;
          if (this.state.path === "") {
            output = filesystem.root[args[0]].split(/\r?\n/);
          } else {
            output = filesystem.root[this.state.path][args[0]].split(/\r?\n/);
          }
          intf.push(<br />);
          for (let i = 0; i < output.length; i++) {
            intf.push(<span>{output[i]}</span>);
          }
          intf.push(<br />);
        } catch {
          intf.push(<span>cat: no such file: {args[0]}</span>);
        }
      }
    } else {
      if (this.state.input !== "") {
        intf.push(<span>dsh: command not found: {command}</span>);
      }
    }
    var cmdList = this.state.cmdList;
    if (this.state.input !== "") {
      cmdList[cmdList.length - 1] = this.state.input;
      cmdList.push("");
    }

    var cmdPosition = cmdList.length - 1;
    console.log(cmdList);

    this.setState({
      intf: intf,
      input: "",
      inputArray: [<mark key={0}>&nbsp;</mark>],
      lastKey: "Enter",
      lastTimestampOfKey: event.timeStamp,
      cursorPosition: 0,
      path: path,
      cmdPosition,
      cmdList,
    });
  }

  async componentDidMount() {
    var keys = {};
    window.addEventListener(
      "keydown",
      function (e) {
        keys[e.key] = true;
        switch (e.key) {
          case "ArrowUp":
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight":
          case "Space":
            e.preventDefault();
            break;
          default:
            break;
        }
      },
      false
    );
    window.addEventListener(
      "keyup",
      function (e) {
        keys[e.key] = false;
      },
      false
    );
    window.addEventListener("keydown", (event) => {
      console.log(event);
      var lastKey;
      var lastTimestampOfKey;
      var cursorPosition;
      var input;
      var cmdList = this.state.cmdList;
      var cmdPosition = this.state.cmdPosition;

      if (this.state.lastTimestampOfKey !== event.timeStamp) {
        if (event.key === "Backspace") {
          if (this.state.cursorPosition === 0) {
            input = this.state.input;
          } else {
            input =
              this.state.input.slice(0, this.state.cursorPosition - 1) +
              this.state.input.slice(this.state.cursorPosition);
          }
          lastKey = event.key;
          lastTimestampOfKey = event.timeStamp;
          if (this.state.cursorPosition >= 1) {
            cursorPosition = this.state.cursorPosition - 1;
          } else {
            cursorPosition = 0;
          }
        } else if (event.key === "ArrowLeft") {
          input = this.state.input;
          lastKey = event.key;
          lastTimestampOfKey = event.timeStamp;
          if (this.state.cursorPosition >= 1) {
            cursorPosition = this.state.cursorPosition - 1;
          } else {
            cursorPosition = 0;
          }
          console.log(cursorPosition);
        } else if (event.key === "ArrowRight") {
          input = this.state.input;
          lastKey = event.key;
          lastTimestampOfKey = event.timeStamp;
          if (this.state.cursorPosition < input.length) {
            cursorPosition = this.state.cursorPosition + 1;
          } else {
            cursorPosition = input.length;
          }
        } else if (event.key === "ArrowUp") {
          if (cmdPosition > 0) {
            cmdPosition--;
          }
          input = cmdList[cmdPosition];
          cursorPosition = input.length;
          lastKey = event.key;
          lastTimestampOfKey = event.timeStamp;
        } else if (event.key === "ArrowDown") {
          if (cmdPosition < cmdList.length - 1) {
            cmdPosition++;
          }
          input = cmdList[cmdPosition];
          cursorPosition = input.length;
          lastKey = event.key;
          lastTimestampOfKey = event.timeStamp;
        } else if (
          event.key === "Shift" ||
          event.key === "Control" ||
          event.key === "Alt" ||
          event.key === "Meta" ||
          event.key === "CapsLock" ||
          event.key === "Dead"
        ) {
          lastKey = event.key;
          lastTimestampOfKey = event.timeStamp;
          input = this.state.input;
          cursorPosition = this.state.cursorPosition;
        } else if (event.key === "Enter") {
          this.handleCommand(this.state.input, event);
        } else {
          input = [
            this.state.input.slice(0, this.state.cursorPosition),
            event.key,
            this.state.input.slice(this.state.cursorPosition),
          ].join("");
          lastKey = event.key;
          lastTimestampOfKey = event.timeStamp;
          cursorPosition = this.state.cursorPosition + 1;
        }
        if (event.key !== "Enter") {
          var inputArray = input.split("");
          if (inputArray.length > cursorPosition) {
            for (let i = 0; i < inputArray.length; i++) {
              if (i === cursorPosition) {
                if (inputArray[i] === " ") {
                  inputArray[i] = <mark key={i}>&nbsp;</mark>;
                } else {
                  inputArray[i] = <mark key={i}>{inputArray[i]}</mark>;
                }
              } else {
                if (inputArray[i] === " ") {
                  inputArray[i] = <span key={i}>&nbsp;</span>;
                } else {
                  // eslint-disable-next-line
                  inputArray[i] = inputArray[i];
                }
              }
            }
          } else {
            for (let i = 0; i < inputArray.length; i++) {
              if (inputArray[i] === " ") {
                inputArray[i] = <span key={i}>&nbsp;</span>;
              } else {
                // eslint-disable-next-line
                inputArray[i] = inputArray[i];
              }
            }
            inputArray.push(<mark key={inputArray.length}>&nbsp;</mark>);
          }
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
            cmdList[cmdPosition] = input;
            cmdPosition = cmdList.length - 1;
          }
          this.setState({
            input: input,
            lastKey: lastKey,
            lastTimestampOfKey: lastTimestampOfKey,
            cursorPosition: cursorPosition,
            inputArray: inputArray,
            cmdPosition,
            cmdList,
          });
        }
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  render() {
    return (
      <div>
        <div className="terminal">
          {this.state.intf.map((item, index) => {
            return <div key={index}>{item}</div>;
          })}
          <span className="inpBox">
            DimasWebsite@you {this.state.path} ~ %&nbsp;
            <span className="input">{this.state.inputArray}</span>
          </span>
        </div>
      </div>
    );
  }
}
