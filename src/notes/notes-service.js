const NotesService = {
    getNotes(knex) {
        return knex.select('*').from('noteful_notes')
    },

    addNotes(knex, newNote) {
        return knex
            .insert(newNote)
            .into('noteful_notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getNote(knex, id) {
        return knex.from('noteful_notes').select('*').where('id',id).first()
    },

    deleteNote(knex, id) {
        return knex ('noteful_notes')
            .where({ id })
            .delete()
    },
}

module.exports = NotesService