const a = (el) => document.querySelector(el);
const b = (el) => document.querySelectorAll(el);
let cart = [];
let modalQt = 1;
let modalKey = 0;

//listagem das pizzas (evento de click p abrir o modal)
pizzaJson.map((item, index)=> {
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    //preencher as informações em pizzaItem 
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        
        a('.pizzaBig img').src = pizzaJson[key].img;
        a('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        a('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        a('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        a('.pizzaInfo--size.selected').classList.remove('selected');
        b('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        a('.pizzaInfo--qt').innerHTML = modalQt;
       
        a('.pizzaWindowArea').style.opacity = 0;
        a('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            a('.pizzaWindowArea').style.opacity = 1;
        }, 50);
        
    });
    a('.pizza-area').append(pizzaItem);
});

//eventos do modal (funcionamento do modal)
function closeModal() {
    a('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        a('.pizzaWindowArea').style.display = 'none';
    }, 200);
}

b('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

a('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if (modalQt > 1) {
        modalQt--;
        a('.pizzaInfo--qt').innerHTML = modalQt;
    };  
});
a('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    modalQt++;
    a('.pizzaInfo--qt').innerHTML = modalQt;
});

b('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        a('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//area do carrinho
a('.pizzaInfo--addButton').addEventListener('click', ()=> {
    //saber qual pizza, tamanho e quantidade;
    let size = parseInt(a('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier  = pizzaJson[modalKey].id+'@'+size;    
    let key = cart.findIndex((item) => item.identifier == identifier);
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();   
});

//carrinho no mobile

a('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        a('aside').style.left = 0;
    }
});
a('.menu-closer').addEventListener('click', ()=> {
    a('aside').style.left = '100vw';
})


function updateCart() {
    a('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) { //caso houver intens no carrinho: carrinho aparece
        a('aside').classList.add('show');
        a('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = a('.models .cart--item').cloneNode(true);
        
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                     break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
        

            a('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        a('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        a('.desconto span:last-child').innerHTML = `- R$ ${desconto.toFixed(2)}`;
        a('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        

    } else { //caso contrário, desaparece
        a('aside').classList.remove('show');
        a('aside').style.left = '100vw';
    }
}

