const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const database = require('../src/db/database');

let server;
let baseUrl;

before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
    await new Promise((resolve) => server.close(resolve));
});

beforeEach(() => {
    database.reset();
});

async function request(path, { method = 'GET', token, body } = {}) {
    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    return {
        status: response.status,
        data,
    };
}

async function login(name, remember = false) {
    const result = await request('/auth/login', {
        method: 'POST',
        body: {
            name,
            password: '1234',
            remember,
        },
    });

    assert.equal(result.status, 200);
    return result.data.token;
}

test('login returns a JWT with user id, role and remember-me expiration', async () => {
    const token = await login('Alan');
    const rememberToken = await login('Alan', true);

    const payload = jwt.decode(token);
    const rememberPayload = jwt.decode(rememberToken);

    assert.equal(payload.userId, 1);
    assert.equal(payload.role, 'lawyer');
    assert.equal(payload.exp - payload.iat, 8 * 60 * 60);
    assert.equal(rememberPayload.exp - rememberPayload.iat, 30 * 24 * 60 * 60);
});

test('case listing is scoped to the authenticated user role', async () => {
    const lawyerToken = await login('Alan');
    const assistantToken = await login('Sara');

    const lawyerCases = await request('/cases', { token: lawyerToken });
    const assistantCases = await request('/cases', { token: assistantToken });

    assert.equal(lawyerCases.status, 200);
    assert.ok(lawyerCases.data.data.length > 0);
    assert.ok(lawyerCases.data.data.every((caseItem) => caseItem.lawyerId === 1));

    assert.equal(assistantCases.status, 200);
    assert.ok(assistantCases.data.data.length > 0);
    assert.ok(assistantCases.data.data.every((caseItem) => caseItem.assistantId === 4));
    assert.ok(assistantCases.data.data.every((caseItem) => caseItem.lawyerName));
});

test('protected endpoints reject missing token', async () => {
    const result = await request('/cases');

    assert.equal(result.status, 401);
});

test('lawyers can create, update and delete their own cases', async () => {
    const token = await login('Alan');

    const created = await request('/cases', {
        method: 'POST',
        token,
        body: {
            caseType: 'Civil',
            presentedAt: '2026-06-02',
            subject: 'Contract review',
            status: 'En curso',
            assistantId: 4,
        },
    });

    assert.equal(created.status, 201);
    assert.equal(created.data.data.lawyerId, 1);
    assert.equal(created.data.data.assistantName, 'Sara');

    const updated = await request(`/cases/${created.data.data.id}`, {
        method: 'PATCH',
        token,
        body: {
            status: 'Pendiente',
            assistantId: 5,
        },
    });

    assert.equal(updated.status, 200);
    assert.equal(updated.data.data.status, 'Pendiente');
    assert.equal(updated.data.data.assistantId, 5);

    const deleted = await request(`/cases/${created.data.data.id}`, {
        method: 'DELETE',
        token,
    });

    assert.equal(deleted.status, 200);
    assert.equal(deleted.data.data.id, created.data.data.id);
});

test('assistants and non-owner lawyers cannot manage cases', async () => {
    const assistantToken = await login('Sara');
    const otherLawyerToken = await login('Dario');

    const createResult = await request('/cases', {
        method: 'POST',
        token: assistantToken,
        body: {
            caseType: 'Civil',
            presentedAt: '2026-06-02',
            subject: 'Unauthorized case',
            status: 'En curso',
        },
    });

    const updateResult = await request('/cases/1', {
        method: 'PATCH',
        token: assistantToken,
        body: { status: 'Pendiente' },
    });

    const deleteResult = await request('/cases/1', {
        method: 'DELETE',
        token: assistantToken,
    });

    const otherLawyerUpdate = await request('/cases/1', {
        method: 'PATCH',
        token: otherLawyerToken,
        body: { status: 'Pendiente' },
    });

    assert.equal(createResult.status, 403);
    assert.equal(updateResult.status, 403);
    assert.equal(deleteResult.status, 403);
    assert.equal(otherLawyerUpdate.status, 403);
});

test('case updates reject missing cases, invalid fields and empty bodies', async () => {
    const token = await login('Alan');

    const missing = await request('/cases/999', {
        method: 'PATCH',
        token,
        body: { status: 'Pendiente' },
    });

    const invalidField = await request('/cases/1', {
        method: 'PATCH',
        token,
        body: { subject: 'Not allowed' },
    });

    const emptyBody = await request('/cases/1', {
        method: 'PATCH',
        token,
        body: {},
    });

    assert.equal(missing.status, 404);
    assert.equal(invalidField.status, 400);
    assert.equal(emptyBody.status, 400);
});

test('only lawyers can list assistants', async () => {
    const lawyerToken = await login('Alan');
    const assistantToken = await login('Sara');

    const lawyerResult = await request('/users/assistants', { token: lawyerToken });
    const assistantResult = await request('/users/assistants', { token: assistantToken });

    assert.equal(lawyerResult.status, 200);
    assert.ok(lawyerResult.data.data.every((user) => user.role === 'assistant'));
    assert.equal(assistantResult.status, 403);
});