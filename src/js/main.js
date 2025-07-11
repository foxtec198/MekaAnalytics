
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
    const types = {
        "VIEW": 0,
        "CLICK": 0,
        "FORM": 0
    }
    const listViews = document.getElementById('listViews')
    listViews.innerHTML = ''

    if(req.ok){
        cont = 0
        res.forEach(item => {
            types[item['type']] += 1
            if(item.dash){dash(item.dash)}
            if(!item.dash){
                const data = new Date(item.data)
                const opcoes = {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                };

                const li = document.createElement('li')
                li.classList.add('list-group-item', 'list-group-item-action')

                const dv = document.createElement('div')
                dv.classList.add('d-flex','flex-column')

                sp1 = document.createElement('span')
                sp1.innerHTML = '<i class="bi bi-building-fill"></i> Cliente: ' + item.name

                sp2 = document.createElement('span')
                sp2.innerHTML = `<i class="bi bi-menu-up"></i> Tipo: ${item.type} IP: ${item.ip}`

                sp3 = document.createElement('span')
                sp3.innerHTML = `<i class="bi bi-calendar-check-fill"></i> ${data.toLocaleDateString('pt-BR', opcoes).replace('.','')}`  
                
                dv.appendChild(sp1)
                dv.appendChild(sp2)
                dv.appendChild(sp3)

                li.appendChild(dv)
                listViews.appendChild(li)
                cont += 1
            }
        });
        if(cont === 0){
            sp = document.createElement('span')
            sp.textContent = 'Sem dados ainda!'

            listViews.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'text-center', 'justify-self-end')
            listViews.appendChild(sp)
            listViews.style.height = '350px'
        }else{
            listViews.classList.remove('d-flex', 'justify-content-center', 'align-items-center', 'text-center', 'justify-self-end')
        }

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

function dash(data = {'dias':0, 'views':0, 'forms':0, 'clicks':0}){
        // Dashboard Vendas
        var dv = document.getElementById('graph')
        var dashVendas = document.createElement('canvas')
        dv.innerHTML = ''

        new Chart(dashVendas, {
            type: 'line',
            data: {
            labels: data['dias'], // DIAS
            
            datasets: [{
                data: data['views'],
                label: 'Visualizações',
                fill: {
                    target: 'origin',
                },
                borderWidth: 1,
                borderColor: '#ae2012',
            },{
                data: data['clicks'],
                label: 'Cliques',
                fill: {
                    target: 'start',
                },
                borderWidth: 2,
                borderColor: '#588157',
            },{
                data: data['forms'],
                label: 'Formularios',
                fill: {
                    target: 'start',
                },
                borderWidth: 2,
                borderColor: '#0077b6',
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
                title: {
                  display: true,
                  text: 'Metricas por dia!'
                }
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