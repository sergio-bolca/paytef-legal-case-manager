const users = require('../data/users');
const cases = require('../data/cases');

class Database {
    constructor() {
        this.users = [...users];
        this.cases = [...cases];
    }

    findUserByName(name) {
        if (!name) return null;
        return this.users.find((user) => user.name.toLowerCase() === name.trim().toLowerCase()) || null;
    }

    findUserById(id) {
        return this.users.find((user) => user.id === id) || null;
    }

    getUsers() {
        return [...this.users];
    }

    getUsersByRole(role) {
        if (!role) return [];
        return this.users.filter((user) => user.role.toLowerCase() === role.trim().toLowerCase());
    }

    getCasesByUser(user) {
        if (user.role === 'lawyer') {
            return this.cases.filter((caseItem) => caseItem.lawyerId === user.id);
        }

        if (user.role === 'assistant') {
            return this.cases.filter((caseItem) => caseItem.assistantId === user.id);
        }

        return [];
    }

    findCaseById(id) {
        return this.cases.find((caseItem) => caseItem.id === id) || null;
    }

    addCase(newCase) {
        const caseToCreate = {
            id: this.getNextCaseId(),
            ...newCase
        };

        this.cases.push(caseToCreate);

        return caseToCreate;
    }

    updateCase(id, data) {
        const caseItem = this.findCaseById(id);
        if (!caseItem) return null;

        if (data.status !== undefined) {
            caseItem.status = data.status;
        }

        if (data.assistantId !== undefined) {
            caseItem.assistantId = data.assistantId;
        }

        return caseItem;
    }

    deleteCase(id) {
        const caseIndex = this.cases.findIndex((caseItem) => caseItem.id === id);
        if (caseIndex === -1) return false;

        this.cases.splice(caseIndex, 1);

        return true;
    }

    getNextCaseId() {
        if (this.cases.length === 0) return 1;
        return Math.max(...this.cases.map((caseItem) => caseItem.id)) + 1;
    }
}

module.exports = new Database();