var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// test connection with the mysql server and sql database
connection.connect(function (err) {
    console.log("Connected as id " + connection.threadId);
    start();
})



function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // Draw the table in the terminal using the response
        console.table(res);

        // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
        promptCustomerForItem(res);
    });

}
function promptCustomerForItem(item){
    let questions = [
        {
            name: "productID",
            type: "input",
            message: "Enter the ID of the product: "

        },

        { 
            name: "productQuantity",
            type: "input",
            message: "Enter the quantity of product: "
        }
    ]


    inquirer
        .prompt(questions)
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            console.log("User typedp: " + answer.productID)
            console.log("User would like the following quantity: " + answer.productQuantity)
            console.log("Database value: " + item[answer.productID - 1].stock_quantity)

            if (answer.productQuantity > item[answer.productID - 1].stock_quantity)
            console.log("Insufficient number of units")
            
            connection.query("UPDATE products SET stock_quantity = stock_quantity - ? where item_id = ? ",[answer.productQuantity, answer.productID],  function (err, res) {
                if (err) throw err;
                
        
                // Draw the table in the terminal using the response
                console.table(res);
        
                // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
                
            });
        });


}

