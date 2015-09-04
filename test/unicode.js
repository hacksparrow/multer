/* eslint-env mocha */

var assert = require('assert')

var path = require('path')
var util = require('./_util')
var multer = require('../')
var temp = require('fs-temp')
var rimraf = require('rimraf')
var FormData = require('form-data')

describe('Unicode', function () {
  var uploadDir, upload

  beforeEach(function (done) {
    temp.mkdir(function (err, path) {
      if (err) return done(err)

      var storage = multer.diskStorage({
        destination: path,
        fileName: function (req, file, cb) {
          cb(null, file.originalName)
        }
      })

      uploadDir = path
      upload = multer({ storage: storage })
      done()
    })
  })

  afterEach(function (done) {
    rimraf(uploadDir, done)
  })

  it('should handle unicode filenames', function (done) {
    var form = new FormData()
    var parser = upload.single('small0')
    var fileName = '\ud83d\udca9.dat'

    form.append('small0', util.file('small0.dat'), { filename: fileName })

    util.submitForm(parser, form, function (err, req) {
      assert.ifError(err)

      assert.equal(path.basename(req.file.path), fileName)
      assert.equal(req.file.originalName, fileName)

      assert.equal(req.file.fieldName, 'small0')
      assert.equal(req.file.size, 1778)
      assert.equal(util.fileSize(req.file.path), 1778)

      done()
    })
  })
})
