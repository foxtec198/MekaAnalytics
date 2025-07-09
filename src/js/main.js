
api = 'http://localhost:9560'
server = api + '/analytics/'
unit_id = sessionStorage.getItem('unit_id')
display_name = sessionStorage.getItem('display_name')

if(!unit_id && window.location.pathname != '/index.html'){
    window.location = 'index.html'
}

// =========================== Callbacks / Functions
async function get_analytics(client = null){
    const req = await fetch(server + `?unit_id=${unit_id}&&client_id=${client}`)
    const res = await req.json()
    const types = {
        "VIEW": 0,
        "CLICK": 0,
        "FORM": 0
    }
    if(req.ok){
        res.forEach(item => {
            types[item['type']] += 1
        });
    
        document.getElementById('views').textContent = types.VIEW
        document.getElementById('clicks').textContent = types.CLICK
        document.getElementById('forms').textContent = types.FORM
    }
}

async function get_clients(){
    const req = await fetch(server + `clients/?unit_id=${unit_id}`)
    const res = await req.json()

    if(req.ok){
        res.forEach(item => {
            const opt = document.createElement('option')
            opt.value = item['id']
            opt.textContent = item['name']
            sel.appendChild(opt)
        })
    }
} 

// =========================== Triggers 

const sel = document.getElementById('clientes')
if(sel){
    sel.addEventListener('change', async function(e){
        e.preventDefault()
        get_analytics(sel.value)
    })
}

const formLogin = document.getElementById('loginForm')
if(formLogin){
    formLogin.addEventListener('submit', async function(e){
        e.preventDefault()

        const email = document.getElementById('email').value
        const pwd = document.getElementById('pwd').value

        dd = {
            "email": email,
            "pwd": pwd
        }

        const req = await fetch(server + 'login/', {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(dd)
        })

        const res = await req.json()
        if(req.ok){
            sessionStorage.setItem('unit_id', res['unit_id'])
            sessionStorage.setItem('display_name', res['display_name'])
            window.location = 'home.html'
        }else{alert(res)}
    })
}