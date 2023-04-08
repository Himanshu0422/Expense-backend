const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.DB);
const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB connection is successful");
});

connection.on("error", (error) => {
  console.log("Error in MongoDB connection", error);
});
const expenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    date: Date,
    id: String
})

const Expense = mongoose.model('Expense', expenseSchema);

app.get('/data', async (req, res)=>{
    const expenses = await Expense.find({});
    console.log(expenses);
    res.json(expenses);
})

app.post('/data', async (req, res) => {
    const data = req.body;
    const expense = new Expense(data);
    await expense.save();
    res.send(expense);
})

app.delete('/data/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Expense.findOneAndDelete({id : id})
        res.send('Item deleted successfully')
      } catch (error) {
        res.status(400).json(error);
    }
});

app.put('/data/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Expense.findOneAndUpdate({id : id} , req.body)
        res.send('Item updated successfully')
    } catch (error) {
        res.status(400).json(error);
    }
})

app.listen(3002, function(req, res){
    console.log("connected on port 3002");
});