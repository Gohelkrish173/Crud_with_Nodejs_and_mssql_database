const express = require('express');
const sqlconn = require("./sqlconn");
const bodyparser = require('body-parser');
const sql = require('msnodesqlv8');

const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
  res.send("Hello World");
});

app.get('/data',async (req,res)=>{
  try{
    const pool = await sqlconn.connect();
    const result = await pool.request().query('select * from country');
    res.json(result.recordset).status(200);
  }
  catch(e){
    console.log(e);
  }
});

app.get('/data/:id',async (req,res)=>{
  try{
    const pool = await sqlconn.connect();
    const result = await pool.request().query(`select * from country where CountryId = ${req.params.id}`);
    res.json(result.recordset).status(200);
  }
  catch(e){
    console.log(e);
  }
});

app.delete('/data/delete/:id',async (req,res)=>{
  try{
    const pool = await sqlconn.connect();
    await pool.request().query(`delete from country where CountryId = ${req.params.id}`);
    const result = await pool.request().query(`select * from country`);
    res.json(result.recordset).status(200);
  }
  catch(e){
    console.log(e);
  }
});

app.post('/data/add',async (req,res)=>{
  try{
    const pool = await sqlconn.connect();

    const {CountryName,CountryCode,CreationDate,ModificationDate} = req.body;

    const query = `INSERT INTO Country (CountryName,CountryCode,CreationDate,ModificationDate) Values(@CountryName,@CountryCode,@CreationDate,@ModificationDate)`;

    await pool.request()
    .input('CountryName',sqlconn.VarChar,CountryName)
    .input('CountryCode',sqlconn.Int,CountryCode)
    .input('CreationDate',sqlconn.DateTime,new Date(CreationDate))
    .input('ModificationDate',sqlconn.DateTime,new Date(ModificationDate))
    .query(query);

    const result = await pool.request().query(`select * from country`);
    res.json(result.recordset);
  }
  catch(e){
    console.log(e);
  }
});

app.patch('/data/edit/:id',async (req,res)=>{
  try{
    const pool =await sqlconn.connect();

    const {CountryName,CountryCode,CreationDate,ModificationDate} = req.body;

    const query=`Update Country set CountryName = @CountryName , CountryCode = @CountryCode , CreationDate=@CreationDate, ModificationDate = @ModificationDate where CountryId = ${req.params.id}`;

    await pool.request()
    .input('CountryName',sqlconn.VarChar,CountryName)
    .input('CountryCode',sqlconn.Int,CountryCode)
    .input('CreationDate',sqlconn.DateTime,new Date(CreationDate))
    .input('ModificationDate',sqlconn.DateTime,new Date(ModificationDate))
    .query(query);

    const result = await pool.request().query('select * from country');
    res.json(result.recordset);
  }catch(e){
    console.log(e);
  }
});

app.listen(3000,()=>{
  console.log("server is connected at port 3000");
})