const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

const connect = () =>{
    return mongoose.connect("mongodb+srv://ankit1:ankit_123@cluster0.fstrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
}

//USER SCHEMA
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    middleName: {type: String, required: false},
    lastName: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    gender: {type: String, required: false , default: "Female"},
    type: {type: String, required: false , default: "customer"},
    master_id: {
        type:mongoose.Schema.Types.ObjectId, ref: "masterAccount", required:true
    }
},
{
    versionKey: false,
    timestamps: true
}
);
// USER MODEL
const User = mongoose.model("user",userSchema) //user =>users

//BRANCHDETAIL SCHEMA
const branchDetailSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    IFSC: {type: String, required: true},
    MICR: {type: Number, required: true}
},
{
    versionKey: false,
    timestamps: true
}
);
// BRANCHDETAIL MODEL
const BranchDetail = mongoose.model("branchDetail",branchDetailSchema);


// MasterAccount SCHEMA
const masterAccountSchema = new mongoose.Schema({
    balance: {type: Number, required: true},
    user_details:{
        type: mongoose.Schema.Types.ObjectId, ref: "user",required: true
    },
    saving_balance:{
        type: mongoose.Schema.Types.ObjectId, ref: "SavingAccount",required: true
    },
    fixed_balance:{
        type: mongoose.Schema.Types.ObjectId, ref: "fixedAccount",required: true
    }
},
{
    versionKey: false,
    timestamps: true
}
);
// MasterAccount MODEL
const MasterAccount = mongoose.model("masterAccount",masterAccountSchema);

// SavingAccount SCHEMA
const savingsAccountSchema = new mongoose.Schema({
    account_number: {type: Number, required: true, unique: true},
    balance: {type: Number, required: true},
    interestRate: {type: Number, required: true}
},
{
    versionKey: false,
    timestamps: true
}
);
// SavingAccount MODEL
const SavingAccount = mongoose.model("SavingAccount",savingsAccountSchema);


//FixedAccount SCHEMA
const fixedAccountSchema = new mongoose.Schema({
    account_number: {type: Number, required: true, unique: true},
    balance: {type: Number, required: true},
    interestRate: {type: Number, required: true},
    startDate: {type: Date, required: true},
    maturityDate: {type: Date, required: true}
},
{
    versionKey: false,
    timestamps: true
}
);
// FixedAccount MODEL
const FixedAccount = mongoose.model("fixedAccount",fixedAccountSchema);


// USER CRUD **********

app.post("/user", async (req, res) => {
   try {
    const user = await User.create(req.body)
    res.send(user)
   } catch (error) {
       console.log('error:', error)
   }
})

app.get("/user", async (req, res) =>{
    try {
    const user = await User.find().lean().exec();
    res.send(user);
    } catch (error) {
        console.log('error:', error)
        
    }
})

// MasterAccount CRUD

app.post("/master", async (req, res) =>{
    try {
        const master = await MasterAccount.create(req.body);
        res.send(master);
    } catch (error) {
        console.log('error:', error)   
    }
})

app.get("/master", async (req, res) =>{
    try {
    const master = await MasterAccount.find().populate({path: "user_details" , Select: ["firstName", "lastName" ,"type"]})
    .populate({path: "saving_balance" , Select: "balance"}).populate({path: "fixed_balance" , Select: "balance"})
    .lean().exec();
    res.send(master);
    } catch (error) {
        console.log('error:', error)
    }
})

app.get("/master/:id", async (req, res) =>{
    try {
    const master = await MasterAccount.findById(req.params.id).lean().exec().populate({path: "master_id" , Select: ["account_number", "balance"]})

    res.send(master);
    } catch (error) {
        console.log('error:', error)
    }
})

// Saving Acount CRUD

app.post("/saving", async (req, res) =>{
    try {
        const saving = await SavingAccount.create(req.body);
        res.send(saving);
    } catch (error) {
        console.log('error:', error)   
    }
})

app.get("/saving", async (req, res) =>{
    try {
    const saving = await SavingAccount.find().lean().exec();
    res.send(saving);
    } catch (error) {
        console.log('error:', error)
    }
})


// Fixed CRUD

app.post("/fixed", async (req, res) =>{
    try {
        const fixed = await FixedAccount.create(req.body);
        res.send(fixed);
    } catch (error) {
        console.log('error:', error)   
    }
})

app.get("/fixed", async (req, res) =>{
    try {
    const fixed = await FixedAccount.find().lean().exec();
    res.send(fixed);
    } catch (error) {
        console.log('error:', error)
    }
})

//Delete API
 app.delete("/fixed/:id",async(res,req) => {
     const fixed = await FixedAccount.findByIdAndDelete(req.params.id);
     res.send(fixed);
 })

app.listen(2345, async function (){
    await connect()
    console.log("listening on port 2345");
})