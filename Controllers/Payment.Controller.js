const Razorpay=require("razorpay")

const razorpay = new Razorpay({
    key_id: `${process.env.KEY_ID}`,
    key_secret: `${process.env.KEY_SECRET}`,
  });

const pay = (req, res) => {
    try {
        let {amount} =req.body
    let options ={
        amount : amount*100
    }
    razorpay.orders.create(options,(err , order) => {
        if(err){
            console.log(err)
            res.send({data : err.message})
        }
        else{
            res.send(order)
        }
    })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports={pay}