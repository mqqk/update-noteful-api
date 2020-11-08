const FoldersService = {
    getFolders(knex) {
        return knex.select('*').from('noteful_folders')
    }
}

module.exports = FoldersService