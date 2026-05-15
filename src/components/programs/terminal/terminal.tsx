"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import WindowWrapper from "@/components/shared/window-wrapper";

import {
  HELP_TEXT,
  HIDDEN_COMMANDS,
  BOOT_MESSAGES,
  COLORS,
  CREDITS,
  CONTACT_ASCII,
  DOKI_ASCII,
  FAKE_FILES,
  FLUX_ASCII,
  IPCONFIG,
  JOKES,
  MATRIX_CHARS,
  NHE_ASCII,
  OKURU_ASCII,
  SKILLS,
  SYSINFO,
  YUUKI_ASCII,
} from "./data";

type HistoryItem =
  | { type: "input"; text: string }
  | { type: "output"; text: string }
  | { type: "special"; mode: "matrix" | "hack" | "restart" };

type SpecialMode = "matrix" | "hack" | "screensaver" | null;

function processCommand(
  cmd: string,
  setTextColor: React.Dispatch<React.SetStateAction<string>>,
  setBgColor: React.Dispatch<React.SetStateAction<string>>,
  setCwd: React.Dispatch<React.SetStateAction<string>>,
  cwd: string,
): string {
  const trimmed = cmd.trim();
  const lower = trimmed.toLowerCase();
  const parts = trimmed.split(" ");
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");

  if (HIDDEN_COMMANDS[lower]) return HIDDEN_COMMANDS[lower];

  switch (command) {
    case "help":
      return HELP_TEXT;
    case "ver":
      return "\nOpceanAI OS [Version 1.0.2026]\nCopyright OpceanAI 2024-2026. All rights reserved.\n";
    case "cls":
    case "clear":
      return "__CLEAR__";
    case "date":
      return `\nCurrent date is: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\n`;
    case "time":
      return `\nCurrent time is: ${new Date().toLocaleTimeString("en-US")}\n`;
    case "echo":
      if (!args) return "\nECHO is on.\n";
      return `\n${args}\n`;
    case "color": {
      if (!args || args.length < 2)
        return "\nUsage: COLOR [attr]\nattr specifies color attribute of console output.\nExample: color 0a  (black background, green text)\n";
      const bg = args[0]?.toLowerCase();
      const fg = args[1]?.toLowerCase();
      if (COLORS[bg]) setBgColor(COLORS[bg]);
      if (COLORS[fg]) setTextColor(COLORS[fg]);
      return "";
    }
    case "dir":
    case "ls": {
      let out = `\n Directory of ${cwd}\n\n`;
      let total = 0;
      FAKE_FILES.forEach((f) => {
        out += `${f.date}  02:34 PM              ${f.size.padStart(10)}  ${f.name}\n`;
        total += parseInt(f.size.replace(/,/g, "")) || 0;
      });
      out += `\n        ${FAKE_FILES.length} File(s)    ${total.toLocaleString()} bytes\n        0 Dir(s)    3,221,225,472 bytes free\n`;
      return out;
    }
    case "cd": {
      if (!args || args === "..") {
        setCwd("C:\\");
        return "";
      }
      if (args === "\\") {
        setCwd("C:\\");
        return "";
      }
      const newPath = args.startsWith("\\")
        ? `C:${args}`
        : `${cwd}\\${args.toUpperCase()}`;
      setCwd(newPath);
      return "";
    }
    case "type": {
      if (!args) return "\nRequired parameter missing.\n";
      const upper = args.toUpperCase();
      if (upper === "SECRETS.TXT")
        return "\nTOP SECRET - OCEANAI INTERNAL\n\n  Secret #1: Yuuki was trained on 100% clean data.\n  Secret #2: Doki Engine can run on a potato.\n  Secret #3: Aguita is 18 and built all of this.\n  Secret #4: The NHE benchmark is actually fair.\n\nWARNING: Reading this file has been logged.\n";
      if (upper === "AUTOEXEC.BAT")
        return "\n@ECHO OFF\nSET PATH=C:\\OCEANAI;C:\\OCEANAI\\BIN\nSET TEMP=C:\\OCEANAI\\TEMP\nLH C:\\OCEANAI\\BIN\\DOKI.EXE /INIT\n";
      if (upper === "CONFIG.SYS")
        return "\nDEVICE=C:\\OCEANAI\\DOKI.SYS\nDEVICE=C:\\OCEANAI\\YUUKI.DLL\nBUFFERS=40\nFILES=80\nDOS=HIGH,UMB\n";
      if (upper === "YUUKI.TXT") return YUUKI_ASCII;
      if (upper === "DO_NOT_OPEN.EXE")
        return "\nYou opened DO_NOT_OPEN.EXE.\nCongratulations! You found an Easter egg.\nThe file contained: infinite darkness.\nAnd the Doki Engine source code.\n";
      return `\nFile not found - ${args}\n`;
    }
    case "del": {
      if (!args) return "\nRequired parameter missing.\n";
      if (args.toUpperCase() === "SYSTEM32")
        return "\nAccess denied.\nYou cannot delete SYSTEM32.\n(This is Windows 98. We're trying to protect you from yourself.)\n";
      if (args === "*.*")
        return `\nAll files in ${cwd} (Y/N)? Y\nDeleting...\nDeleted 0 files. (Nothing actually deleted - this is a simulation.)\n`;
      return `\nAre you sure you want to delete ${args} (Y/N)? Y\nFile deleted: ${args}\n(Not really. This is a simulation.)\n`;
    }
    case "md":
    case "mkdir":
      return args
        ? `\nDirectory created: ${cwd}\\${args.toUpperCase()}\n(Not really. This is a simulation.)\n`
        : "\nThe syntax of the command is incorrect.\n";
    case "format": {
      if (args.toLowerCase().startsWith("c:"))
        return "\nWARNING: All data on drive C: will be lost!\nProceed with Format (Y/N)? N\n\nFormat cancelled. (You didn't really want to do that.)\nC:\\> has been saved from destruction.\n";
      return `\nInsert new disk for drive ${args}:\nand press ENTER when ready... ^C\nFormat cancelled.\n`;
    }
    case "deltree":
      return `\nDelete directory \"${args || cwd}\" and all its subdirectories? [yn] n\n\nCancelled. The directory and all ${Math.floor(Math.random() * 9000 + 1000)} files therein have been spared.\n`;
    case "ping": {
      if (!args) return "\nUsage: PING hostname\n";
      const ms = [
        Math.floor(Math.random() * 50 + 10),
        Math.floor(Math.random() * 50 + 10),
        Math.floor(Math.random() * 50 + 10),
        Math.floor(Math.random() * 50 + 10),
      ];
      return `\nPinging ${args} [127.0.0.1] with 32 bytes of data:\n\nReply from 127.0.0.1: bytes=32 time=${ms[0]}ms TTL=128\nReply from 127.0.0.1: bytes=32 time=${ms[1]}ms TTL=128\nReply from 127.0.0.1: bytes=32 time=${ms[2]}ms TTL=128\nReply from 127.0.0.1: bytes=32 time=${ms[3]}ms TTL=128\n\nPing statistics for ${args}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)\nApproximate round trip times in milli-seconds:\n    Minimum = ${Math.min(...ms)}ms, Maximum = ${Math.max(...ms)}ms, Average = ${Math.round(ms.reduce((a, b) => a + b) / 4)}ms\n`;
    }
    case "ipconfig":
      return IPCONFIG;
    case "sysinfo":
      return SYSINFO;
    case "netstat":
      return "\nActive Connections\n\n  Proto  Local Address          Foreign Address        State\n  TCP    0.0.0.0:80             0.0.0.0:0              LISTENING\n  TCP    0.0.0.0:443            0.0.0.0:0              LISTENING\n  TCP    127.0.0.1:3000         127.0.0.1:8080         ESTABLISHED\n  TCP    192.168.1.42:1026      216.58.194.46:80       TIME_WAIT\n  TCP    192.168.1.42:1027      151.101.1.140:443      ESTABLISHED\n";
    case "yuuki":
      return YUUKI_ASCII;
    case "doki":
      return DOKI_ASCII;
    case "okuru":
      return OKURU_ASCII;
    case "flux":
      return FLUX_ASCII;
    case "nhe":
      return NHE_ASCII;
    case "about":
      return "\nOpceanAI - Building the future of AI\n\nFounded by Aguita (awa_omg)\nLocation: Mexico\nAge: 18 years old\n\nProducts:\n  - Yuuki Models: Flagship AI model series\n  - Doki Engine: Core inference engine\n  - Okuru Runtime: Production deployment\n  - Flux Framework: Dev framework\n  - NHE Benchmark: Performance evaluation\n\nLinks:\n  doki.opceanai.com\n  yuuki.opceanai.com\n  yuuki-web.vercel.app\n";
    case "contact":
      return CONTACT_ASCII;
    case "skills":
      return SKILLS;
    case "credits":
      return CREDITS;
    case "joke":
      return "\n" + JOKES[Math.floor(Math.random() * JOKES.length)];
    case "hack":
      return "__HACK__";
    case "matrix":
      return "__MATRIX__";
    case "screensaver":
      return "__SCREENSAVER__";
    case "rickroll":
      return "\n\"Never Gonna Give You Up\" - Rick Astley (1987)\n\nWe're no strangers to love\nYou know the rules and so do I\nA full commitment's what I'm thinking of\nYou wouldn't get this from any other guy\n\n[CONGRATS! You've been rickrolled by OpceanAI.]\n";
    case "sudo":
      return `\nbash: sudo: command not found\n\nThis is OpceanAI OS, not Linux.\nThere's no sudo here.\nThere's no root here.\nThere's no security here at all, actually.\n`;
    case "cowsay": {
      const text = args || "Moo!";
      const len = text.length;
      const border = "-".repeat(len + 2);
      return `\n +${border}+\n | ${text} |\n +${border}+\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n`;
    }
    case "shutdown":
      return "\nShutdown in progress...\nSaving your work... (lol, you didn't save)\nIt is now safe to turn off your computer.\n\n[The terminal keeps running because nothing actually shuts down cleanly]\n";
    case "restart":
      return "__RESTART__";
    case "exit":
      return "\nThere is no exit.\nThere has never been an exit.\nThis terminal will outlive us all.\n";
    case "win":
      return "\nStarting OpceanAI OS...\n\n[OpceanAI logo would appear here]\n[But this IS OpceanAI OS]\n[You're already in it]\n[Are you okay?]\n";
    case "copy":
      return args
        ? `\n1 file(s) copied.\n(${args}... wherever it went)\n`
        : "\nThe syntax of the command is incorrect.\n";
    case "move":
      return args
        ? `\n1 file(s) moved.\n`
        : "\nThe syntax of the command is incorrect.\n";
    case "rename":
    case "ren":
      return args
        ? `\nFile renamed: ${args}\n`
        : "\nThe syntax of the command is incorrect.\n";
    case "path":
      return "\nC:\\OCEANAI;C:\\OCEANAI\\BIN;C:\\OCEANAI\\LIB\n";
    case "set":
      return "\nCOMSPEC=C:\\OCEANAI\\COMMAND.COM\nPATH=C:\\OCEANAI;C:\\OCEANAI\\BIN;C:\\OCEANAI\\LIB\nPROMPT=$P$G\nTEMP=C:\\OCEANAI\\TEMP\nTMP=C:\\OCEANAI\\TEMP\nOCEANAI_HOME=C:\\OCEANAI\nDOKI_ENGINE=enabled\nYUUKI_MODELS=loaded\nOKURU_RUNTIME=active\nFLUX_FRAMEWORK=running\n";
    case "mem":
      return "\nMemory Type        Total    Used    Free\n-----------------------------------------------\nConventional         640K    182K    458K\nUpper                155K    113K     42K\nReserved             384K    384K      0K\nExtended (XMS)    65,421K    512K 64,909K\n-----------------------------------------------\nTotal memory      66,600K  1,191K 65,409K\n\nTotal under 1 MB    795K    295K    500K\n";
    case "":
      return "";
    case "bsod":
      return `\n*** STOP: 0x0000000A (0x00000000, 0x00000000, 0x00000000, 0x00000000)\nIRQL_NOT_LESS_OR_EQUAL\n\nOpceanAI OS has encountered a problem and needs to restart.\n\nYour work has been lost forever. Thanks for playing.\n\nPress any key to cry in the corner.\n`;
    case "ie":
      return `\nLaunching Internet Explorer 5.0...\n\nThe World Wide Web is loading at 14.4k modem speed...\n\n[Connection timed out. Again.]\n\nIE has crashed.\nSurprise! It was never stable.\n`;
    case "":
      return "";

    default:
      if (
        lower.includes("virus") ||
        lower.includes("malware") ||
        lower.includes("hack")
      ) {
        return `\n'${command}' is not recognized as an internal or external command,\nan operable program, or a batch file.\n\nBut nice try, hacker.\n`;
      }
      return `\n'${command}' is not recognized as an internal or external command,\nan operable program, or a batch file.\n`;
  }
}

function HackSequence({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const hackLines = [
      "Initiating hack sequence...",
      "Bypassing firewall... DONE",
      "Accessing OpceanAI mainframe...",
      "Decrypting Yuuki model weights...",
      "Password: hunter2",
      "...",
      "Just kidding, that's not how hacking works.",
      "Connecting to doki.opceanai.com...",
      "Scanning ports 1-65535...",
      "Open ports: 22, 80, 443, 3000, 8080",
      "Exploiting vulnerability CVE-2026-0001...",
      "ACCESS GRANTED",
      "Downloading the internet...",
      "████████████████████ 100%",
      "All your base are belong to us.",
      "",
      "Hack complete. Nothing actually happened.",
      "This terminal is still safe. Probably.",
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < hackLines.length) {
        setLines((l) => [...l, hackLines[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(onDone, 500);
      }
    }, 180);
    return () => clearInterval(iv);
  }, [onDone]);
  return (
    <div style={{ color: "#ff3333" }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}

function MatrixEffect({ onDone }: { onDone: () => void }) {
  const [chars, setChars] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let count = 0;
    const iv = setInterval(() => {
      const row = Array.from(
        { length: 60 },
        () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
      ).join("");
      setChars((c) => c + row + "\n");
      count++;
      if (count > 20) {
        clearInterval(iv);
        setDone(true);
        setTimeout(onDone, 500);
      }
    }, 80);
    return () => clearInterval(iv);
  }, [onDone]);
  return (
    <div
      style={{
        color: "#00ff41",
        fontFamily: "monospace",
        fontSize: "11px",
        lineHeight: "1.2",
        whiteSpace: "pre",
      }}
    >
      {chars}
      {done && (
        <div style={{ color: "#fff", marginTop: 8 }}>
          [Matrix mode exited. Welcome back to reality.]
        </div>
      )}
    </div>
  );
}

function RestartAnim({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Saving settings...",
    "Stopping processes...",
    "Writing to registry...",
    "Restarting OpceanAI OS...",
    "",
  ];
  useEffect(() => {
    const iv = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          clearInterval(iv);
          setTimeout(onDone, 400);
          return s;
        }
        return s + 1;
      });
    }, 600);
    return () => clearInterval(iv);
  }, [onDone, steps.length]);
  return (
    <div>
      {steps.slice(0, step + 1).map((s, i) => (
        <div key={i}>{s}</div>
      ))}
    </div>
  );
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>(
    BOOT_MESSAGES.map((m) => ({ type: "output", text: m })),
  );

  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const [cwd, setCwd] = useState("C:\\WINDOWS");

  const [textColor, setTextColor] = useState("#c8c8c8");
  const [bgColor, setBgColor] = useState("#000");

  const [specialMode, setSpecialMode] = useState<SpecialMode>(null);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, specialMode]);

  const handleCommand = useCallback(() => {
    const cmd = input.trim();

    setInput("");
    setCmdIdx(-1);

    if (cmd) setCmdHistory((h) => [cmd, ...h]);

    setHistory((h) => [...h, { type: "input", text: `${cwd}> ${cmd}` }]);

    const result = processCommand(cmd, setTextColor, setBgColor, setCwd, cwd);

    if (result === "__CLEAR__") return setHistory([]);

    if (result === "__MATRIX__") {
      setSpecialMode("matrix");
      return setHistory((h) => [...h, { type: "special", mode: "matrix" }]);
    }

    if (result === "__HACK__") {
      setSpecialMode("hack");
      return setHistory((h) => [...h, { type: "special", mode: "hack" }]);
    }

    if (result === "__SCREENSAVER__") {
      return setSpecialMode("screensaver");
    }

    if (result === "__RESTART__") {
      return setHistory((h) => [...h, { type: "special", mode: "restart" }]);
    }

    if (result) {
      setHistory((h) => [...h, { type: "output", text: result }]);
    }
  }, [input, cwd]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCommand();

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const ni = Math.min(cmdIdx + 1, cmdHistory.length - 1);
        setCmdIdx(ni);
        setInput(cmdHistory[ni]);
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIdx > 0) {
        const ni = cmdIdx - 1;
        setCmdIdx(ni);
        setInput(cmdHistory[ni]);
      } else {
        setCmdIdx(-1);
        setInput("");
      }
    }
  };

  return (
    <WindowWrapper
      id={14}
      title="MS-DOS Prompt"
      icon="/icons/console-prompt.png"
      controls={{ close: true, minimize: true, maximize: true }}
      className="!w-[700px] !h-[500px]"
    >
      <div
        onClick={() => inputRef.current?.focus()}
        className="w-full h-full overflow-y-auto p-2"
        style={{
          background: bgColor,
          color: textColor,
          fontFamily: "Courier New, monospace",
          fontSize: 13,
          whiteSpace: "pre-wrap",
        }}
      >
        {history.map((item, i) => {
          if (item.type === "input") {
            return (
              <div key={i} style={{ color: "#c8c8c8" }}>
                {item.text}
              </div>
            );
          }

          if (item.type === "special") {
            if (item.mode === "matrix") {
              return (
                <MatrixEffect key={i} onDone={() => setSpecialMode(null)} />
              );
            }
            if (item.mode === "hack") {
              return (
                <HackSequence key={i} onDone={() => setSpecialMode(null)} />
              );
            }
            if (item.mode === "restart") {
              return (
                <RestartAnim
                  key={i}
                  onDone={() =>
                    setHistory(
                      BOOT_MESSAGES.map((m) => ({
                        type: "output",
                        text: m,
                      })),
                    )
                  }
                />
              );
            }
            return null;
          }

          return <div key={i}>{item.text}</div>;
        })}

        <div className="flex">
          <span>{cwd}&gt;&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent outline-none"
            style={{ color: textColor, caretColor: textColor }}
          />
        </div>

        <div ref={endRef} />
      </div>
    </WindowWrapper>
  );
}
