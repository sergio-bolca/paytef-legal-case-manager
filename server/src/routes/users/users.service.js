const database = require('../../db/database');

function listAssistants() {
    const assistants = database.getUsersByRole('assistant');

    return assistants.map((assistant) => ({
        id:     assistant.id,
        name:   assistant.name,
        role:   assistant.role,
    }));
}

module.exports = {
    listAssistants,
};