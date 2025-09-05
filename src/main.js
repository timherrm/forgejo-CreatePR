const core = require('@actions/core');
const ForgejoAPI = require('./forgejo');

async function run() {
    try {
        const api_url = core.getInput('api_url');
        const token = core.getInput('token');
        const repository = core.getInput('repository');

        const assigneesInput = core.getInput('assignees');
        const assignees = assigneesInput
            ? assigneesInput.split(',').map(a => a.trim()).filter(Boolean)
            : undefined;

        const base = core.getInput('base');
        const body = core.getInput('body');
        
        let due_date = core.getInput('due_date');
        if (due_date && /^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
            due_date = `${due_date}T23:59:59+01:00`;
        }

        const head = core.getInput('head');

        const labelsInput = core.getInput('labels');
        const labels = labelsInput
            ? labelsInput.split(',').map(a => a.trim()).filter(Boolean).map(Number)
            : undefined;

        const milestone = Number(core.getInput('milestone'));
        let ref = core.getInput('ref');
        if (ref && !ref.startsWith('refs/heads/')) {
            ref = `refs/heads/${ref}`;
        }
        const title = core.getInput('title');
        const debug = core.getInput('debug') === 'true';

        const forgejo = new ForgejoAPI(api_url, token, debug);

        let result;

        result = await forgejo.CreatePR(
            repository,
            assignees,
            base,
            body,
            due_date,
            head,
            labels,
            milestone,
            title
        );
        core.setOutput('result', JSON.stringify(result, null, 2));
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();