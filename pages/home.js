const home = (req, res) => {

        const { userId } = req.session;

        let content = `<h1>Welcome!</h1>
    ${userId ? `<div>Hello User</div>
    <form method="POST" action="/logout">
        <input type="submit" value="logout" />
    </form>` : '<a href="/login">login</a> <a href="/register">register</a>' }
    `;
    res.send(content);
} 


const logout = (req, res) => {
    req.session.destroy(err => {
        if(err){
            return res.redirect("/");
        }
        res.clearCookie(process.env.SESSION_ID);
        res.redirect('/login');
    })
}

module.exports = { home, logout };