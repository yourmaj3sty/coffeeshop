document.addEventListener('alpine:init', () => {
  Alpine.data('order', () => ({
    items: [
      { id: 1, name: 'Nikmat Espresso', img: '2.jpg', price: 25000 },
      { id: 2, name: 'Nikmat Machiato', img: '3.jpg', price: 27000 },
      { id: 3, name: 'Nikmat Latte', img: '1.jpg', price: 37000 },
      { id: 4, name: 'Ngeteh Nikmat', img: '4.jpg', price: 18000 },
      { id: 5, name: 'Chicken Wings', img: '5.jpg', price: 40000 },
      { id: 6, name: 'Coffee Macarons', img: '6.jpg', price: 68000 },
    ],
  }));

  Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        this.items.push({...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        })
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    }
  });
});

// Foorm Validation

const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disable = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function () {
  for (let i = 0; i < form.elements; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove('disable');
      checkoutButton.classList.add('disable');
    } else {
      return false;
    }
  }
  checkoutButton.disable = false;
  checkoutButton.classList.remove('disable');
});

checkoutButton.addEventListener('click', async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open("http://wa.me/6285163522004?text=" + encodeURIComponent(message));

  try {
    const response = await fetch('php/placeOrder.php', {
      method: 'POST',
      body: data,
    });
    const token = await response.text();
    // console.log(token);
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// const formatMessage = (objData) => {
//   return `Data Customer
//     Nama: ${obj.name}
//     Email: ${obj.email}
//     Phone: ${obj.phone}
// Data Pesanan
//   ${JSON.parse(obj.items).map(
//     (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
//   )}
// TOTAL: ${rupiah(obj.total)}
// Terima Kasih.`;
// };

const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};
