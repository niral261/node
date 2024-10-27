const fs = require("fs");

// fs.writeFileSync("./test.txt","Hey there")
// fs.writeFile("./test.txt","Hey there Async", (err) => {})

// const res = fs.readFileSync('./contacts.txt',"utf-8");
// console.log(res);

// fs.readFile('./contacts.txt',"utf-8", (err,result) => {
//     if(err){
//         console.log("Error",err);
//     }
//     else {
//         console.log(result)
//     }
// });


fs.appendFileSync("./test.txt", new Date().getDate().toLocaleString());