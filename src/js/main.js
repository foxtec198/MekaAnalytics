
api = 'http://localhost:9560'
api = 'https://api.hubbix.com.br'

server = api + '/analytics/'
unit_id = sessionStorage.getItem('unit_id')
display_name = sessionStorage.getItem('display_name')

if(!unit_id && window.location.pathname != '/index.html'){
    window.location = 'index.html'
}

// =========================== Callbacks / Functions
async function get_analytics(client = '0'){
    if(client && client !== '0'){
        req = await fetch(
            server + `?unit_id=${unit_id}&&client_id=${client}`
        )
    }else{
        req = await fetch(server + `?unit_id=${unit_id}`)
    }
    const res = await req.json()
    console.log(res)
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
            const dv = document.createElement('div')
            dv.classList.add('d-flex')

            const img = document.createElement('img')
            img.src = `https://api.hubbix.com.br/img/logo.png`
            img.alt = 'favicon'
            
            const span = document.createElement('span')
            span.textContent = item['name']

            dv.appendChild(img)
            dv.appendChild(span)

            const opt = document.createElement('option')
            opt.value = item['id']
            opt.appendChild(dv)
            sel.appendChild(opt)
        })
    }
} 

function dash(){
        // Dashboard Vendas
        var dv = document.getElementById('graph')
        var dashVendas = document.createElement('canvas')
        dv.innerHTML = ''

        new Chart(dashVendas, {
            type: 'line',
            data: {
            labels: [1,2,3,4], // DIAS
            
            datasets: [{
                data: [10,20,30,60],
                label: 'Visualizações',
                fill: {
                    target: 'origin',
                },
                borderWidth: 1,
                borderColor: '#fff',
            },{
                data: [1,10,5,3],
                label: 'Cliques',
                fill: {
                    target: 'start',
                },
                borderWidth: 2,
                borderColor: '#f0f0f0',
            },{
                data: [1,11,20,35],
                label: 'Formularios',
                fill: {
                    target: 'start',
                },
                borderWidth: 2,
                borderColor: '#f0f0f0',
            }]
            },
            options: {
            indexAxis: 'x', 
            responsive: true,
            aspectRatio: 0,
            scales: {
                x: {
                    beginAtZero: false
                },
                y: {
                    display: false
                }
            },
            plugins: {
                // title: {
                //   display: true,
                //   text: 'PRODUTOS POR ' + opt.toUpperCase()
                // }
            },
            }
        })
        dv.appendChild(dashVendas)
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

namee = document.getElementById('name').textContent = display_name