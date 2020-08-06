//////////BUDGET CONTROLLER//////////
let controllerBudget = (function () {

    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

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
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            //push it into data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },
        testing: function () {
            console.log(data)
        }
    }

})()


//////////UI CONTROLLER//////////////
let controllerUI = (function () {

    let domStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }

    return {
        getInput: function () {
            return {
                addType: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDesc).value,
                value: document.querySelector(domStrings.inputValue).value
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, el;

            //Create HTML strings with placeholder text
            if (type === 'inc') {
                el = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                el = domStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value)

            //Insert he HTML into the DOM
            document.querySelector(el).insertAdjacentHTML('beforeend', newHtml)

        },

        getDOMStrings: function () {
            return domStrings
        }
    }

})()

////////////APP CONTROLLER//////////////
let controllerApp = (function (ctrlBudget, ctrlUI) {

    let setUpEventListener = function () {
        let dom = ctrlUI.getDOMStrings()
        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        })
    }

    let ctrlAddItem = function () {

        let input, newItem;

        //1.get the field input data
        input = ctrlUI.getInput()

        //2. add the item to the budget controller
        newItem = ctrlBudget.addItem(input.addType, input.description, input.value)

        //3.add the item to the ui controller
        ctrlUI.addListItem(newItem, input.addType)

        //4.calculate budget

        //5. display budget on UI
    }

    return {
        init: function () {
            console.log('Hey I am active');
            setUpEventListener()
        }
    }

})(controllerBudget, controllerUI)

controllerApp.init()