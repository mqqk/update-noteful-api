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
    .post(jsonParser, (req,res,next) => {
        const { name, content, folder_id } = req.body
        const newNote = { name, content, folder_id }

        for(const [key,value] of Object.entries(newNote))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
        newNote.folder_id = folder_id
        NotesService.addNotes(
            req.app.get('db'),
            newNote
        )
        .then(note => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl + `/${note.id}`))
                .json(serializeNote(note))
        })
        .catch(next)
    })

    notesRouter
        .route('/:note_id')
        .all((req,res,next) => {
            NotesService.getNote(
                req.app.get('db'),
                req.params.note_id
            )
                .then(note => {
                    if(!note) {
                        return res.status(404).json({
                            error: { message: 'Note does not exist'}
                        })
                    }
                    res.note=note
                    next()
                })
                .catch(next)
        })

        .get((req,res,next) => {
            res.json(serializeNote(res.note))
        })

        .delete((req,res,next) => {
            NotesService.deleteNote(
                req.app.get('db'),
                req.params.note_id
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        })

    module.exports = notesRouter