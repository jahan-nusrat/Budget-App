//////////BUDGET CONTROLLER//////////
let controllerBudget = (function () {
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach((type) => {
            sum += type.value;
        });
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            let newItem, ID;

            //[1 2 3 4 5] next ID= 6
            //[1,2,4,6,8] next ID=9
            //Id= last ID+1

            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Create new item based on 'exp' or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //push it into data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        deleteItem: function (type, id) {
            let ids, index;
            ids = data.allItems[type].map(function (items) {
                return items.id;
            });
            index = ids.indexOf(id)
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            //calculate the budget :inc-exp
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
            //Expense=100 Income= 200, spent 50%= 100/200 = 0.5*100
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                income: data.totals.inc,
                expense: data.totals.exp
            };
        },

        testing: function () {
            console.log(data);
        }
    };
})();

//////////UI CONTROLLER//////////////
let controllerUI = (function () {
    let domStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        dateLabel: '.budget__title--month',
        container: '.container'
    };

    return {
        getInput: function () {
            return {
                addType: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDesc).value,
                value: +document.querySelector(domStrings.inputValue).value
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, el;

            //Create HTML strings with placeholder text
            if (type === 'inc') {
                el = domStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                el = domStrings.expenseContainer;
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert he HTML into the DOM
            document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
        },

        //Clear input fields
        clearFields: function () {
            let fields;
            fields = document.querySelectorAll(domStrings.inputDesc + ', ' + domStrings.inputValue);
            //let fieldsArr= Array.prototype.slice.call(fields)
            //fieldsArr.forEach(current=>{current.value="";})
            //or,
            fields.forEach((current) => {
                current.value = '';
            });
            //focus on the input description after clearing fields
            fields[0].focus();
        },

        displayBudget: function (obj) {
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.incomeLabel).textContent = obj.income;
            document.querySelector(domStrings.expenseLabel).textContent = obj.expense;

            if (obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = '----'
            }
        },

        displayMonth: function () {
            let monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let now, year;
            now = new Date()
            year = now.getFullYear();
            month = now.getMonth()
            date = now.getDate()
            document.querySelector(domStrings.dateLabel).textContent = monthArray[month] + ' ' + date + 'th' + ' ' + year;
        },

        getDOMStrings: function () {
            return domStrings;
        }
    };
})();

////////////APP CONTROLLER//////////////
let controllerApp = (function (ctrlBudget, ctrlUI) {
    let setUpEventListener = function () {
        let dom = ctrlUI.getDOMStrings();
        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem)
    };

    let updateBudget = function () {
        let budget;

        //1.Calculate budget
        ctrlBudget.calculateBudget();

        //2.Return Budget
        budget = ctrlBudget.getBudget();

        //3.Display budget on UI
        ctrlUI.displayBudget(budget)
    };

    let ctrlAddItem = function () {
        let input, newItem;

        //1. get the field input data
        input = ctrlUI.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2. add the item to the budget controller
            newItem = ctrlBudget.addItem(input.addType, input.description, input.value);

            //3. add the item to the ui controller
            ctrlUI.addListItem(newItem, input.addType);

            //4. Clear the fields
            ctrlUI.clearFields();

            //5. Calculate and update budget
            updateBudget();
        }
    };

    let ctrlDeleteItem = function (event) {
        let itemId, splitId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            //1. delete the item from data structure
            ctrlBudget.deleteItem(type, id)

            //2. delete item from UI

            //3. update and show new budget

        }
    };

    return {
        init: function () {
            console.log('Hey I am active');
            ctrlUI.displayBudget({
                budget: 0,
                percentage: -1,
                income: 0,
                expense: 0
            })
            setUpEventListener();
            ctrlUI.displayMonth()
        }

    };
})(controllerBudget, controllerUI);

controllerApp.init();