const http = require('http');
const fs = require('fs')
const requests = require('requests')
require('dotenv').config({ path: './.env' })

const htmlFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (fileHTML, dataObj1) => {
    // console.log(dataObj1.main.temp)
    // console.log(dataObj1.main.temp_min)
    // console.log(dataObj1.main.temp_max)
    // console.log(dataObj1.name)
    console.log(dataObj1.sys.country)
    // console.log(fileHTML)
    let newHtmlTextFile = fileHTML.replace("{%temp%}", dataObj1.main.temp)
    newHtmlTextFile = newHtmlTextFile.replace("{%minTemp%}", dataObj1.main.temp_min)
    newHtmlTextFile = newHtmlTextFile.replace("{%maxTemp%}", dataObj1.main.temp_max)
    newHtmlTextFile = newHtmlTextFile.replace("{%location%}", dataObj1.name)
    newHtmlTextFile = newHtmlTextFile.replace("{%country%}", dataObj1.sys.country)
    newHtmlTextFile = newHtmlTextFile.replace("{%weather%}", dataObj1.weather[0].main)
    console.log(newHtmlTextFile)
    return newHtmlTextFile;
}

const server = http.createServer((req, res) => {
    requests(`https://api.openweathermap.org/data/2.5/weather?q=Kathmandu&appid=${process.env.WEATHER_API_KEY}`)
        .on('data', (chunk) => {
            // console.log(chunk)
            const dataObj = JSON.parse(chunk);
            const dataArr = [dataObj];
            // console.log("Weather: ", dataArr[0].weather.main)
            // const realTimeData = dataArr.map(dataObj1 => {
            //     console.log(htmlFile)
            //     console.log(dataObj1)
            // })
            // const realTimeData = dataArr.map(dataObj1 => replaceVal(htmlFile, dataObj1) )
            // console.log(realTimeData) //array one sring(html file with dynamic data)
            // res.write(realTimeData[0]);
            const realTimeData = dataArr.map(dataObj1 => replaceVal(htmlFile, dataObj1)).join("")
            // console.log(realTimeData) //array one sring(html file with dynamic data)
            res.write(realTimeData);
        })

        .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
            console.log('end');
        });
})
server.listen(process.env.PORT, "127.0.0.1", () => console.log("Listening to server at http://localhost:8000"));


// Output print two time because of favicon.