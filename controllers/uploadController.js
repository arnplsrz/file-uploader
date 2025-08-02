const getUpload = (req, res) => {
  if (!req.user) return res.redirect('/signin')

  res.status(200).render('index', {
    title: 'Upload',
    content: 'pages/upload',
    user: req.user,
  })
}

const postUpload = (req, res) => {
  console.log(req.body, req.file)

  res.status(200).render('index', {
    title: 'Upload',
    content: 'pages/upload',
    user: req.user,
  })
}

module.exports = {
  getUpload,
  postUpload,
}
