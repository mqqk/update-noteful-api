const path = require('path')
const express = require('express')
const NotesService = require('./notes-service')
const { notEqual } = require('assert')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    folder_id:note.folder_id,
    id:note.id,
    name:note.name,
    modified:note.modified,
    content:note.content
})

notesRouter
    .route('/')
    .get((req,res,next) => {
        // res.send('hi')
        const knexInstance = req.app.get('db')
        NotesService.getNotes(knexInstance)
            .then(notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next)
    })

    module.exports = notesRouter