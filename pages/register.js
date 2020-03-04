const Users = require("./data.js");

const registerGet = (req, res) => {
    let contet = `<h1>Register</h1><form method="POST" action="/register">
        <input type="text" name="uname" placeholder="username" />
        <input type="password" name="passwd" placeholder="password" />
        <input type="submit" value="submit" />
    </form>
    <a href="/login">login</a>`;
    res.send(contet);
}

const registerPost = (req, res) => {
    const { uname, passwd } = req.body;
    if (uname && passwd) {
        const userExist = Users.some(user => user.name === uname);
        if (!userExist) {
            Users.push({ _id: Users.length + 1, name: uname, password: passwd });
            req.session.userId = Users.length + 1;
            return res.redirect("/");
        }
    }
    throw new Error("Fields requires");
    //res.redirect("/register");
}

module.exports = { registerGet, registerPost };