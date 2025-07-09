
api = 'http://localhost:9560'
server = api + '/analytics/'
unit_id = 1

async function get_analytics(client = null){
    const req = await fetch(server + `?unit_id=${unit_id}&&client_id=${client}`)
    const res = await req.json()
    const types = {
        "VIEW": 0,
        "CLICK": 0,
        "FORM": 0
    }

    res.forEach(item => {
        types[item['type']] += 1
    });

    document.getElementById('views').textContent = types.VIEW
    document.getElementById('clicks').textContent = types.CLICK
    document.getElementById('forms').textContent = types.FORM
}

get_analytics()