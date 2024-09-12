let hoy = 30
let usuarioActual = 0
let idMedicine = location.href
idMedicine = parseInt(idMedicine.slice(-1))

function show_alarm(obj){
    let padre1 = obj.parentNode
    let padre2 = padre1.parentNode
    let hermano1 = obj.nextSibling.firstChild
    let hermano2 = padre2.nextSibling.nextSibling
    let hijo1 = hermano2.firstChild.nextSibling
    if ($(obj).is(':checked')){
        $(hermano2).toggle('visible')
        $(hijo1).addClass('visible')
        $(hermano1).text('check')
    } else {
        $(hermano2).toggle('visible')
        $(hijo1).removeClass('visible')
        $(hermano1).text('')
    }
}

function show_options(obj){
    let hermano1 = obj.parentNode.parentNode.nextSibling.nextSibling
    if($(obj).text() == 'expand_more'){
        $(obj).text('expand_less')
        $(hermano1).addClass('mostrarBotones')
    } else {
        $(hermano1).removeClass('mostrarBotones')
        $(obj).text('expand_more')
    }
}

function add_rutine(obj){
    let padre = $(obj).parent()[0]
    padre = padre.previousSibling.previousSibling
    padre = $(padre).children()[1]

    $(padre).append(`<article class="product">
        <div class="product-info">
            <div class="text-container">
                <div class="line"></div>
                <div class="text">
                    <div class="time">
                        <p class="main-title">Hoy a las</p>
                        <input type="number" class="main-title" value="10" max="24">
                        <p class="main-title">:</p>
                        <input type="number" class="main-title" value="00" max="59">
                    </div>
                    <div class="type">
                        <div class="cant">
                            <span class="material-icons-outlined" onclick="less(this)">expand_more</span>
                            <p>1</p>
                            <span class="material-icons-outlined" onclick="more(this)">expand_less</span>
                        </div>
                        <select name="type" onchange="select_change(this)">
                            <option value="capsule">Capsula</option>
                            <option value="tablet">Tableta</option>
                            <option value="drink">Bebida</option>
                            <option value="dust">Polvo</option>
                            <option value="packet">Paquete</option>
                            <option value="ointment">Unguento</option>
                            <option value="cream">Crema</option>
                            <option value="solution">Solucion</option>
                            <option value="syrup">Cucharada</option>
                            <option value="lotion">Locion</option>
                            <option value="other">Otro</option>
                        </select>
                        <div id="text-container">
                            <input type="text" id="other-text" class="sub-title" placeholder="Otro...">
                        </div>
                    </div>
                </div>
            </div>
            <div class="icon-container">
            </div>
        </div>
    </article>`)
}

function show_blur(obj){
    let body = $('#body-index')
    let time = $(obj).parent()[0]
    time = $(time).children()[0]
    time = $(time).children()[1]
    time = $(time).children()[1]
    time = $(time).text()

    let hour = time.slice(10, -3)
    let minute = time.slice(13)

    $(body).append(`<div class="blur">
        <div class="edit-alarm">
            <div class="icon-left" onclick="go_to('home')">
                <span class="material-icons-outlined">cancel</span>
            </div>
            <div class="icon">
                <span class="material-icons-outlined">timer</span>
            </div>
            <p class="main-title">Hoy a las</p>
            <div class="clock">
                <input type="number" value="`+hour+`">
                <p>:</p>
                <input type="number" value="`+minute+`">
            </div>
            <button onclick="go_to('home')">Guardar</button>
        </div>
    </div>`)
}

function select(obj){
    let hijo = $(obj).children()[0]

    $('.selected').removeClass('selected')
    $(obj).addClass('selected')

    fetch('json/medicamentos.json')
    .then(res => res.json())
    .then(data => {
        let day = parseInt($(hijo).text())
        let all_products_calendar = $('#all-products-calendar')
        let intervalId = 0

        $(all_products_calendar).html('')

        data.forEach(e => {
            e.days.forEach(elem => {
                if(elem == day){
                    intervalId = intervalId+1
                    $(all_products_calendar).append(`<article class="product">
                        <div class="interval" id="interval_calendar`+intervalId+`">
    
                        </div>
                        <div class="product-info">
                            <div class="line-container">
                                <div class="line"></div>
                            </div>
                            <div class="product-img" style="background-image: url(./img/`+e.image+`);"></div>
                            <div class="product-desc">
                                <p class="main-title" onclick="go_to('product')">`+e.name+`</p>
                                <p class="sub-title gray">Dosis `+e.alarms[0].cant+` `+e.type+`</p>
                            </div>
                        </div>
                    </article>
                    <div class="mid-line">
                    <hr><div class="dot"></div>
                    </div>`)
    
                    let interval_calendar = $('#interval_calendar'+intervalId)
                    let product_desc_index = $('#product-desc-index'+intervalId)
                    let alarm_desc_index = $('#alarm-desc-index'+intervalId)
                    let product_desc_calendar = $('#product-desc-calendar'+intervalId)
                    let unaVez = 0

                    e.alarms.forEach(alarm => {
                        if(alarm.user == usuarioActual){
                            $(interval_calendar).append(`<p class="main-title gray">`+alarm.hour+`:`+alarm.minute+`</p>`)
                            if(unaVez == 0){
                                $(product_desc_index).append(`<p class="sub-title gray">Hoy a las `+alarm.hour+`:`+alarm.minute+`</p>`)
                                $(alarm_desc_index).append(`<p class="sub-title">Alarma a las `+alarm.hour+`:`+alarm.minute+`</p>`)
                                $(product_desc_calendar).append(`<p class="sub-title gray">Dosis `+alarm.cant+` `+e.type+`</p>`)
                                unaVez = unaVez + 1
                            }
                        }
                    })
                }
            })
        })
    })
}

function more(obj){
    let hermano = obj.previousSibling.previousSibling
    let num = Number($(hermano).text())

    $(hermano).text(num+1)
}

function less(obj){
    let hermano = obj.nextSibling.nextSibling
    let num = Number($(hermano).text())

    if(num > 1){
        $(hermano).text(num-1)
    }
}

function select_change(obj) {
    let text = $(obj.nextSibling.nextSibling);

    if (obj.value === 'other') {
        $(text).addClass('visible');
    } else {
        $(text).removeClass('visible');
    }
}

function take_product(obj){
    idMedicine = $(obj).parent()[0]
    idMedicine = parseInt($(idMedicine).children()[1].value)

    go_to('product',idMedicine)
}

function go_to(d,id){
    switch (d){
        case "home":
            window.location = 'index.html'
        break;
        case "product":
            window.location = 'product.html?idMedicine='+id
        break;
        case "calendar":
            window.location = 'calendar.html'
        break;
        case "add":
            window.location = 'add.html'
        break;
        case "graphic":
            window.location = 'graphic.html'
        break;
        case "profile":
            window.location = 'profile.html'
        break;
        case "edit-product":
            window.location = 'edit-product.html'
        break;
        case "back":
            window.history.back()
        break;
    }
}

fetch('json/usuarios.json')
.then(res => res.json())
.then(data => {
    let titulo = $('#titulo-index')
    let profile = $('#main-product-profile')
    let main_product = $('#main-product-index')
    data.forEach(e => {
        if(e.id == usuarioActual){
            $(titulo).text('Hola, '+e.name+'!')
            $(profile).html(`<article class="main-product">
                <div class="main-product-img-container">
                    <div class="main-product-img" style="background-image: url(./img/`+e.image+`);"></div> 
                </div>
                <div class="main-product-desc">
                    <p class="main-title">`+e.name+`</p>
                    <p class="sub-title gray">`+e.desc+`</p>
                </div>
                <nav id="nav-profile">

                </nav>
            </article>`)

            fetch('json/medicamentos.json')
            .then(res => res.json())
            .then(data2 => {
                let nav = $('#nav-profile')
                e.medicines.forEach(el => {
                    data2.forEach(elem => {
                        if(elem.id == e.main){
                            let unico = 0

                            $(main_product).html(`<div class="main-product-img" style="background-image: url(./img/`+elem.image+`);"></div>
                                <div class="main-product-desc" id="main-product-desc-index">
                                <p class="main-title" onclick="go_to('product')">`+elem.name+`</p>
                            </div>`)

                            let main_product_desc_index = $('#main-product-desc-index')

                            elem.alarms.forEach(alarm => {
                                if(alarm.user == usuarioActual && unico == 0){
                                    $(main_product_desc_index).append(`<p class="sub-title gray">Hoy a las `+alarm.hour+`:`+alarm.minute+`</p>`)
                                    unico = unico + 1
                                }
                            })
                        }

                        if(el == elem.id){
                            $(nav).append(`<article class="product" onclick="go_to('product',`+elem.id+`)">
                                <div class="product-img" style="background-image: url(./img/`+elem.image+`);"></div>
                                <div class="product-desc">
                                    <p class="main-title">`+elem.name+`</p>
                                    <p class="sub-title gray">Dosis `+elem.alarms[0].cant+` `+elem.type+`</p>
                                </div>
                            </article>`)
                        }
                    })
                })
            })
        }
    })
})

fetch('json/medicamentos.json')
.then(res => res.json())
.then(data => {
    let all_products = $('#all-products-index')
    let all_products_calendar = $('#all-products-calendar')
    let all_products_product = $('#all-products-product')
    let main_product_product = $('#main-product-product')
    let checkId = 0
    data.forEach(e => {
        let unaVez = 0
        if(e.id == idMedicine){
            $(main_product_product).html(`<div class="main-product-img-container">
            <div class="main-product-img" style="background-image: url(./img/`+e.image+`);"></div> 
            </div>
            <div class="main-product-desc">
                <p class="main-title">`+e.name+`</p>
                <p class="sub-title gray">`+e.desc+`</p>
            </div>
            <div class="main-product-frecuency">
                <div class="frecuency">
                    <div class="frecuency-container">
                        <p class="sub-title gray">Duracion</p>
                    </div>
                    <div class="frecuency-container">
                        <span class="icon material-icons-outlined">calendar_month</span>
                        <p class="main-title">`+e.duration+`</p> 
                    </div>
                </div>
                <div class="quantity">
                    <div class="quantity-container">
                        <p class="sub-title gray">Frecuencia</p>
                    </div>
                    <div class="quantity-container">
                        <span class="icon material-icons-outlined">watch_later</span>
                        <p class="main-title">`+e.frecuency+`</p>
                    </div>
                </div>
            </div>`)

            e.alarms.forEach(alarm => {
                if(alarm.user == usuarioActual){
                    $(all_products_product).append(`<article class="product">
                    <div class="product-info">
                        <div class="text-container">
                            <div class="line"></div>
                            <div class="text">
                                <p class="main-title">Hoy a las `+alarm.hour+`:`+alarm.minute+`</p>
                                <p class="sub-title gray">`+alarm.cant+` `+e.type+` `+e.name+`</p>
                            </div>
                        </div>
                        <div class="icon-container">
                            <span class="icon material-icons-outlined gray" onclick="show_options(this)">expand_more</span>
                        </div>
                    </div>
                    <div class="options">
                        <button class="later">Mas Tarde</button>
                        <button class="done">Terminado</button>
                    </div>
                </article>`)
                }
            })
        }
        e.days.forEach(elem => {
            if(elem == hoy){
                checkId = checkId+1
                $(all_products).append(`<article class="product">
                    <div class="product-info">
                        <div class="product-img" style="background-image: url(./img/`+e.image+`);"></div>
                        <div class="product-desc" id="product-desc-index`+checkId+`">
                            <p class="main-title" onclick="take_product(this)">`+e.name+`</p>
                            <input type="hidden" value="`+e.id+`">
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" id="check`+checkId+`" onclick="show_alarm(this)"><label for="check`+checkId+`" class="label-check"><span class="material-icons-outlined"></span></label>
                        </div> 
                    </div>
                    <div class="alarm" onclick="show_blur(this)">
                        <div class="alarm-info">
                            <div class="alarm-desc" id="alarm-desc-index`+checkId+`">
                                <div class="icon">
                                    <span class="material-icons-outlined">timer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>`)

                $(all_products_calendar).append(`<article class="product">
                    <div class="interval" id="interval_calendar`+checkId+`">

                    </div>
                    <div class="product-info">
                        <div class="line-container">
                            <div class="line"></div>
                        </div>
                        <div class="product-img" style="background-image: url(./img/`+e.image+`);"></div>
                        <div class="product-desc" id="product-desc-calendar`+checkId+`">
                            <p class="main-title" onclick="go_to('product')">`+e.name+`</p>
                        </div>
                    </div>
                </article>
                <div class="mid-line">
                <hr><div class="dot"></div>
                </div>`)

                let interval_calendar = $('#interval_calendar'+checkId)
                let product_desc_index = $('#product-desc-index'+checkId)
                let alarm_desc_index = $('#alarm-desc-index'+checkId)
                let product_desc_calendar = $('#product-desc-calendar'+checkId)
                unaVez = 0

                e.alarms.forEach(alarm => {
                    if(alarm.user == usuarioActual){
                        $(interval_calendar).append(`<p class="main-title gray">`+alarm.hour+`:`+alarm.minute+`</p>`)
                        if(unaVez == 0){
                            $(product_desc_index).append(`<p class="sub-title gray">Hoy a las `+alarm.hour+`:`+alarm.minute+`</p>`)
                            $(alarm_desc_index).append(`<p class="sub-title">Alarma a las `+alarm.hour+`:`+alarm.minute+`</p>`)
                            $(product_desc_calendar).append(`<p class="sub-title gray">Dosis `+alarm.cant+` `+e.type+`</p>`)
                            unaVez = unaVez + 1
                        }
                    }
                })
            }
        })
    });
})