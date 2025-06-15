import { baseUrl } from '../variables.js'

async function events(userName) {
    const response = await fetch(`${baseUrl}/${userName}/events`);
    return await response.json();
}

export { events };