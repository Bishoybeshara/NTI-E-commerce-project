const Order = require('../models/order.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');


exports.getSalesReport = catchAsync(async(req, res, next)=>{
  const {startDate , endDate} = req.query;

  const matchStage = {status:'delivered'};

  if(startDate || endDate) {
    matchStage.createdAt = {};
    if(startDate) matchStage.createdAt.$gte = new Date(startDate);
    if(endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const report = await Order.aggregate([
    {$match: matchStage},
    {
      $facet:{
        // Overall sales
        overallStats:[
          {  
            $group: {
              _id :null,
              totalRevenue:{$sum: '$total_amount'},
              totalOrders: {$sum:1}
            }
          } 
        ],
        // Top Selling products
        topProducts:[
          {$unwind:'$items'},
          {
            $group: {
              _id: '$items.product',
              name: {$first: '$items.name'},
              image_url: {$first: '$items.image_url'},
              totalQuantity:{$sum:'$items.quantity'},
              totalRevenue:{$sum:{$multiply:['$items.quantity' , '$items.unit_price'] }}
            }
          },
          {$sort: {totalRevenue : -1}},
          {$limit:5}
        ],
        // Monthly sales
        monthlySales:[
          {
            $group: {
              _id:{
                year:{$year:'$createdAt'},
                month:{$month:'$createdAt'}
              },
              totalRevenue: {$sum:'$total_amount'},
              totalOrders:{$sum:1}
            }
          },
            {$sort:{'_id.year':1, '_id.month':1}}
        ],
        // top users paying
        topUsers:[
          {
            $group:{
              _id:'$user',
              totalSpent:{$sum:'$total_amount'},
              totalOrders:{$sum:1}
            }
          },
          {$sort:{totalSpent:-1}},
          {$limit:5},
          {
            $lookup: {
              from:'users',
              localField:'_id',
              foreignField:'_id',
              as:'user'
            }
          },
          {$unwind:'$user'},
          {
            $project:{
              name:'$user.name',
              email:'$user.email',
              totalSpent:1,
              totalOrders:1
            }
          }
        ]
      }
    }
  ]);

  res.status(200).json({
    status:'success',
    data:report[0]
  });
});