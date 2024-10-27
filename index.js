const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

// REST API
app.get("/api/users", (req, res) => {
    return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (user) {
        return res.json(user);
    } else {
        return res.status(404).json({ error: "User not found" });
    }
});

app.post("/api/users", (req, res) => {
    return req.json({ status: "pending"});
})

app.patch("/api/users/:id", (req, res) => {
    return req.json({ status: "pending"});
})

app.delete("/api/users/:id", (req, res) => {
    return req.json({ status: "pending"});
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
