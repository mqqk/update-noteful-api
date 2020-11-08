const path = require('path')
const express = require('express')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id:folder.id,
    name:folder.name
})

foldersRouter
    .route('/')
    .get((req,res,next) => {
        // res.send('hi')
        const knexInstance = req.app.get('db')
        FoldersService.getFolders(knexInstance)
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next)
    })

    module.exports = foldersRouter