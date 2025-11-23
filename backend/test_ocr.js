const { spawn } = require("child_process");

const python = spawn("python", ["ocr_service.py", "uploads/1763888322747-4011.png"]);

python.stdout.on("data", d => console.log("stdout:", d.toString()));
python.stderr.on("data", d => console.log("stderr:", d.toString()));
python.on("close", () => console.log("DONE"));
