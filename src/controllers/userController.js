import bcrypt from 'bcrypt'
import User from '../models/User'
import fetch from 'node-fetch'
import { token } from 'morgan'

export const getLogin = (req, res) => {
  return res.render('login', { pageTitle: 'Login' })
}

export const postLogin = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username, socialOnly: false })
  if (!user) {
    return res.status(400).render('login', { pageTitle: 'Login', errorMessage: 'No matched user.' })
  }
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    return res.status(400).render('login', { pageTitle: 'Login', errorMessage: 'No matched password.]' })
  }
  req.session.loggedIn = true
  req.session.user = user
  return res.redirect('/')
}

export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize'
  const config = {
    client_id: process.env.GH_CLIENT,
    scope: 'read:user user:email',
    allow_signup: false
  }
  const params = new URLSearchParams(config).toString()
  const finalUrl = `${baseUrl}?${params}`
  return res.redirect(finalUrl)
}

export const finishGithubLogin = async (req, res) => {
  const { code } = req.query
  const baseUrl = 'https://github.com/login/oauth/access_token'
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code,
  }
  const params = new URLSearchParams(config).toString()
  const finalUrl = `${baseUrl}?${params}`

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json()
  if ('access_token' in tokenRequest) {
    const { access_token } = tokenRequest
    const apiUrl = 'https://api.github.com/user'
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json()

    const emailData = await (
      await fetch(`${apiUrl}/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    res.redirect('/login')
  }
}

export const getJoin = (req, res) => {
  return res.render('join', { pageTitle: 'Join' })
}

export const postJoin = async (req, res) => {
  const { email, username, name, password, password2, location } = req.body
  const pageTitle = 'Join'
  if (password !== password2) {
    return res.status(400).render('join', { pageTitle, errorMessage: 'Password confirmation does not match.' })
  }
  try {
    await User.create({
      email,
      username,
      name,
      password,
      location
    })
    return res.redirect('/login')
  } catch (error) {
    return res.status(400).render('join', { pageTitle, errorMessage: error._message })
  } 
}

export const logout = (req, res) => {
  req.session.destroy()
  return res.redirect('/')
}