const Users = require("./data.js");

const loginGet = (req, res) => {
    let contet = `<h1>Login Page</h1><form method="POST" action="/login">
        <input type="text" name="uname" placeholder="username" required />
        <input type="password" name="passwd" placeholder="password" required />
        <input type="submit" value="login" />
    </form>
    <a href="/register">register</a>`;
    res.send(contet);
}

const loginPost = (req, res) => {
    const { uname, passwd } = req.body;
    if(uname && passwd) {
        let user = Users.find(user => user.name === uname && user.password === passwd);
        if(user){
            req.session.userId = user._id;
            return res.redirect("/");
        }
    }
    res.redirect("/login");
}

module.exports = { loginGet, loginPost };