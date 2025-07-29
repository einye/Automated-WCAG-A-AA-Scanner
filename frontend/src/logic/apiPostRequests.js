export async function SendUrl(apiUrl , theinputurl) {

    try {
        const response = await fetch(apiUrl , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: theinputurl,
            })
        })

        const data = await response.json();

        return ({response: response, data: data, error: null});

    } catch (error) {
        console.error(error);
        return({response: null, data: null, error: error});
    }
}
