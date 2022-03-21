const temp = [
  {
    path: '/temp',
    name: 'temp',
    component: resolve => require(['../../pages/tempIFrame'], resolve),
    meta: {
      title: 'Data Link'
    }
  }
]

export default temp
