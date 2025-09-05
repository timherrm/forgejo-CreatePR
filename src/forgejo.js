class ForgejoAPI {
    constructor(api_url, token, debug = false) {
        this.api_url = api_url;
        this.token = token;
        this.debug = debug;
    }

    async CreatePR(repository,assignees,base,body,due_date,head,labels,milestone,title) {
        const requestBody = {};
        if (assignees) requestBody.assignees = assignees;
        if (base) requestBody.base = base;
        if (body) requestBody.body = body;
        if (due_date) requestBody.due_date = due_date;
        if (head) requestBody.head = head;
        if (labels) requestBody.labels = labels;
        if (milestone) requestBody.milestone = milestone;
        if (title) requestBody.title = title;

        // Debug output
        if (this.debug) {
            console.log('CreatePR payload:', requestBody);
        }

        const response = await this._makeRequest(
            `/repos/${repository}/pulls`,
            'POST',
            requestBody
        );
        return response.data;
    }

    async _makeRequest(endpoint, method, data) {
        const url = `${this.api_url}${endpoint}`;
        const options = {
            method,
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            data
        };

        if (this.debug) {
            console.log('ForgejoAPI request:', {
                url,
                method,
                headers: options.headers,
                data
            });
        }

        const axios = require('axios');
        return await axios(url, options);
    }
}

module.exports = ForgejoAPI;