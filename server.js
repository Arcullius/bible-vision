// http is a core Node module to help you work with
// HTTP requests and responses (abbreviated as req and res)
const http = require("http");

// fs is a core Node module that helps you work with the file system
// it deals with reading and writing the contents of files and folders
const fs = require("fs");

// path is a core Node library that helps you get the file paths corrent
// it helps you manipulate file names and directory names
const path = require("path");

// every web server runs on a port -- this allows a single computer to 
// run many web servers (by giving them each a different port number)
const PORT = 3000;

function validateTodosShape(parsed_json){
    if (!Array.isArray(parsed_json)) return false;
    for (const item of parsed_json) {
        if (typeof item !== "object" || item === null) return false;
        if (typeof item.task !== "string") return false;
        if (typeof item.done !== "boolean") return false;
    }
    return true;
}
// http provides a createServer function that takes a callback function as
// an argument.  When you first create the server you don't have the request
// yet, but we can give it a function that will accept the request later
const server = http.createServer(function (req, res) {
    if (req.method === "GET") {
        // Serve index.html
        if (req.url === "/" || req.url === "/index.html") {
            const html = fs.readFileSync(path.join(__dirname, "index.html"));
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(html);
            return;
        }
        // Serve to-do.json
        if (req.url === "/to-do.json") {
            const json = fs.readFileSync(path.join(__dirname, "to-do.json"));
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(json);
            return;
        }
        // Serve static files (.js, .css)
        if (req.url.endsWith(".js") || req.url.endsWith(".css")) {
            // Remove leading slash
            const fileName = req.url.startsWith("/") ? req.url.slice(1) : req.url;
            const filePath = path.join(__dirname, fileName);
            if (fs.existsSync(filePath)) {
                let contentType = "text/plain";
                if (req.url.endsWith(".js")) contentType = "application/javascript";
                if (req.url.endsWith(".css")) contentType = "text/css";
                const fileContent = fs.readFileSync(filePath);
                res.writeHead(200, { "Content-Type": contentType + "; charset=utf-8" });
                res.end(fileContent);
                return;
            }
        }
        res.writeHead(404);
        res.end("Not found");
        return;
    }
    

    if (req.method === "POST" && req.url === "/save") {
        let body = "";
        // the data over the web doesn't arrive all at once.  Instead, it 
        // comes in small chunks, a little bit at a time. The http module
        // conveniently gives us the "data" and "end" events
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            fs.writeFileSync(path.join(__dirname, "to-do.json"), body, "utf8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end('{"status":"ok"}');
        });
        return;
    }
    // HTTP works with special status codes like 200 (OK), 404 (Not Found)
    // 405 (Not Allowed) and 500 (Server Error).  We send a 405 code here 
    // because any other kind of HTTP request (such as PUT or DELETE) is not
    // allowed by our very simple program
    res.writeHead(405);
    res.end("Method not allowed");
});

server.listen(PORT, function () {
    console.log("Server running at http://localhost:" + PORT);
});
