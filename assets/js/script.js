const cash = document.getElementById('cash');
const displayChangeDue = document.getElementById('change-due');
const purchaseBtn = document.getElementById('purchase-btn');
const totalPrice = document.getElementById('total-price');
const priceListDisplay = document.getElementsByName('price-list-display');

let price = 3.26;
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
];

const formatResults = (status, change) => {
    displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
    change.map(
      money => (displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
    );
    return;
};

const purchaseProcess = () => {

    if (Number(cash.value) < price) {
        alert('Customer does not have enough money to purchase the item');
        cash.value = '';
        cash.autofocus;
        displayChangeDue.style.display = 'none';
        return;
    }

    if (Number(cash.value) === price) {
        displayChangeDue.style.display = 'block';
        displayChangeDue.innerHTML = '<p>No change due - customer paid with exact cash</p>';
        cash.value = '';
        cash.autofocus;
        return;
    }

    let changeDue = Number(cash.value) - price;
    let reversedCid = [...cid].reverse();
    let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
    let result = { status: 'OPEN', change: [] };
    let totalCID = parseFloat(
        cid.map(total => total[1]).reduce((prev, curr) => prev + curr).toFixed(2)
    );

    if (totalCID < changeDue) {
        displayChangeDue.style.display = 'block';
        return (displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
    }

    if (totalCID === changeDue) {
        result.status = 'CLOSED';
    }

    for (let i = 0; i <= reversedCid.length; i++) {
        if (changeDue > denominations[i] && changeDue > 0) {
            let count = 0;
            let total = reversedCid[i][1];
            while (total > 0 && changeDue >= denominations[i]) {
                total -= denominations[i];
                changeDue = parseFloat((changeDue -= denominations[i]).toFixed(2));
                count++;
            }
            if (count > 0) {
                result.change.push([reversedCid[i][0], count * denominations[i]]);
            }
        }
    }

    if (changeDue > 0) {
        displayChangeDue.style.display = 'block';
        return (displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
    }

    formatResults(result.status, result.change);
    updateDefaultUI(result.change);
}

const purchase = () => {
    if (!cash.value) {
        displayChangeDue.style.display = 'none';
        return;
    } else {
        purchaseProcess();
    }
}

const updateDefaultUI = change => {
    const currencyNameList = {
        PENNY: 'Pennies',
        NICKEL: 'Nickels',
        DIME: 'Dimes',
        QUARTER: 'Quarters',
        ONE: 'Ones',
        FIVE: 'Fives',
        TEN: 'Tens',
        TWENTY: 'Twenties',
        'ONE HUNDRED': 'Hundreds'
    }

    if (change) {
        change.forEach(changeArr => {
            const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
            targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
        });
    }

    cash.value = '';
    totalPrice.innerHTML = `<p>Total: <span>$${price}</span></p>`;
    priceListDisplay.innerHTML = `
    <p><storng>Change in drawer:<strong></p>
    ${
        cid.map(money => `<span>${currencyNameList[money[0]]}: $${money[1]}</span>`).join('')
    }
    `;

};

purchaseBtn.addEventListener('click', purchase);

cash.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        purchase();
    }
});

updateDefaultUI();