const database = require('../../db/database');

function mapCaseWithNames(caseItem) {
    const lawyer    = database.findUserById(caseItem.lawyerId);
    const assistant = caseItem.assistantId ? database.findUserById(caseItem.assistantId) : null;

    return {
        ...caseItem,
        lawyerName: lawyer ? lawyer.name : null,
        assistantName: assistant ? assistant.name : null
    };
}

function listCasesByUser(user) {
    const cases = database.getCasesByUser(user);
    return cases.map(mapCaseWithNames);
}

function createCase(user, caseData) {
    if (user.role !== 'lawyer') {
        return {
            error: {
                status: 403,
                message: 'Only lawyers can create cases.'
            }
        };
    }

    if (!caseData || typeof caseData !== 'object' || Array.isArray(caseData)) {
        return {
            error: {
                status: 400,
                message: 'Request body must be an object.'
            }
        };
    }

    const { caseType, presentedAt, subject, status, assistantId } = caseData;

    if (!caseType || !presentedAt || !subject || !status) {
        return {
            error: {
                status: 400,
                message: 'caseType, presentedAt, subject and status are required.'
            }
        };
    }

    if (assistantId !== undefined && assistantId !== null) {
        const assistant = database.findUserById(Number(assistantId));

        if (!assistant || assistant.role !== 'assistant') {
            return {
                error: {
                    status: 400,
                    message: 'assistantId must belong to an existing assistant.'
                }
            };
        }
    }

    const newCase = database.addCase({
        caseType,
        presentedAt,
        subject,
        status,
        lawyerId: user.id,
        assistantId: assistantId === undefined || assistantId === null ? null : Number(assistantId)
    });

    return {
        data: mapCaseWithNames(newCase),
    };
}

function updateCase(user, caseId, updateData) {
    const caseItem = database.findCaseById(caseId);

    if (!caseItem) {
        return {
            error: {
                status: 404,
                message: 'Case not found.'
            }
        };
    }

    if (user.role !== 'lawyer' || caseItem.lawyerId !== user.id) {
        return {
            error: {
                status: 403,
                message: 'You do not have permission to edit this case.'
            }
        };
    }

    if (!updateData || typeof updateData !== 'object' || Array.isArray(updateData)) {
        return {
            error: {
                status: 400,
                message: 'Request body must be an object.'
            }
        };
    }

    const allowedFields = ['status', 'assistantId'];
    const invalidFields = Object.keys(updateData).filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        return {
            error: {
                status: 400,
                message: 'Only status and assistantId can be updated.'
            }
        };
    }

    if (!allowedFields.some((field) => Object.prototype.hasOwnProperty.call(updateData, field))) {
        return {
            error: {
                status: 400,
                message: 'At least status or assistantId must be provided.'
            }
        };
    }

    const dataToUpdate = {};

    if (updateData.status !== undefined) {
        if (!updateData.status) {
            return {
                error: {
                    status: 400,
                    message: 'status cannot be empty.'
                }
            };
        }

        dataToUpdate.status = updateData.status;
    }

    if (updateData.assistantId !== undefined) {
        if (updateData.assistantId !== null) {
            const assistant = database.findUserById(Number(updateData.assistantId));

            if (!assistant || assistant.role !== 'assistant') {
                return {
                    error: {
                        status: 400,
                        message: 'assistantId must belong to an existing assistant.'
                    }
                };
            }

            dataToUpdate.assistantId = Number(updateData.assistantId);
        } else {
            dataToUpdate.assistantId = null;
        }
    }

    const updatedCase = database.updateCase(caseId, dataToUpdate);

    return {
        data: mapCaseWithNames(updatedCase)
    };
}

function deleteCase(user, caseId) {
    const caseItem = database.findCaseById(caseId);

    if (!caseItem) {
        return {
            error: {
                status: 404,
                message: 'Case not found.'
            }
        };
    }

    if (user.role !== 'lawyer' || caseItem.lawyerId !== user.id) {
        return {
            error: {
                status: 403,
                message: 'You do not have permission to delete this case.'
            }
        };
    }

    database.deleteCase(caseId);

    return {
        data: {
            id: caseId
        }
    };
}

module.exports = {
    listCasesByUser,
    createCase,
    updateCase,
    deleteCase
};
